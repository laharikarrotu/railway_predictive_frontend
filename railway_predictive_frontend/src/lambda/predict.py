import json
import os
import boto3
import numpy as np

def normalize_inputs(inputs):
    """Normalize input values to the same scale used in training"""
    return {
        'temperature': float(inputs['temperature']) / 150,  # Max temperature 150°C
        'vibration': float(inputs['vibration']) / 50,      # Max vibration 50
        'pressure': float(inputs['pressure']) / 500,       # Max pressure 500
        'rpm': float(inputs['rpm']) / 10000               # Max RPM 10000
    }

def get_status_and_action(probability):
    """Determine status and recommended action based on probability"""
    if probability < 0.3:
        return "Low Risk", "Normal operation - no action needed"
    elif probability < 0.7:
        return "Medium Risk", "Schedule maintenance within next 48 hours"
    else:
        return "High Risk", "Immediate maintenance required"

def lambda_handler(event, context):
    try:
        print("Testing SageMaker endpoint access...")
        runtime = boto3.client('runtime.sagemaker')
        
        # List available endpoints
        sm_client = boto3.client('sagemaker')
        endpoints = sm_client.list_endpoints()
        print("Available endpoints:", endpoints)
        
        # Get endpoint name from environment variable
        endpoint_name = os.environ.get('ENDPOINT_NAME')
        if not endpoint_name:
            raise ValueError("ENDPOINT_NAME environment variable not set")
        print(f"Using endpoint: {endpoint_name}")
        
        print("Received event:", event)
        
        # Parse input data - handle both string and dict body
        if isinstance(event['body'], str):
            request_body = json.loads(event['body'])
        else:
            request_body = event['body']
            
        raw_inputs = request_body['inputs']
        print("Raw inputs:", raw_inputs)
        
        # Normalize inputs
        normalized_inputs = normalize_inputs(raw_inputs)
        print("Normalized inputs:", normalized_inputs)
        
        # Extract values in correct order
        features = np.array([
            normalized_inputs['temperature'],
            normalized_inputs['vibration'],
            normalized_inputs['pressure'],
            normalized_inputs['rpm']
        ]).reshape(1, -1)
        
        print("Features array:", features)
        
        # Uncomment the SageMaker integration code
        print(f"Attempting to invoke endpoint: {endpoint_name}")
        
        response = runtime.invoke_endpoint(
            EndpointName=endpoint_name,
            ContentType='application/json',
            Body=json.dumps({'inputs': features.tolist()})
        )
        print("Successfully invoked endpoint")
        result = json.loads(response['Body'].read().decode())
        probability = float(result['probability'])
        
        # Get status and recommended action
        status, action = get_status_and_action(probability)
        
        response_body = {
            'probability': probability * 100,  # Convert to percentage
            'prediction': 1 if probability > 0.5 else 0,
            'confidence': abs(probability - 0.5) * 2 * 100,    # Convert to percentage
            'status': status,
            'action': action,
            'raw_inputs': {
                'temperature': raw_inputs['temperature'],
                'vibration': raw_inputs['vibration'],
                'pressure': raw_inputs['pressure'],
                'rpm': raw_inputs['rpm']
            }
        }
        
        print("Response body:", response_body)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST,OPTIONS'
            },
            'body': json.dumps(response_body)
        }
        
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        print(f"Event that caused error: {event}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST,OPTIONS'
            },
            'body': json.dumps({
                'error': str(e),
                'message': 'Error making prediction'
            })
        } 