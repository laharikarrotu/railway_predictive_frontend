import os
os.environ['NUMPY_VERSION'] = '1.23.5'
import numpy as np
np.__version__ = '1.23.5'  # Force NumPy version
import tensorflow as tf

def model_fn(model_dir):
    model = tf.keras.models.load_model(os.path.join(model_dir, 'model'))
    return model

def input_fn(request_body, request_content_type):
    if request_content_type == 'application/json':
        import json
        input_data = json.loads(request_body)
        return np.array(input_data['inputs'])
    else:
        raise ValueError("Unsupported content type: {}".format(request_content_type))

def predict_fn(input_data, model):
    predictions = model(input_data)
    return predictions

def output_fn(prediction, response_content_type):
    if response_content_type == 'application/json':
        import json
        return json.dumps({
            'probability': float(prediction[0][0])
        })
    else:
        raise ValueError("Unsupported content type: {}".format(response_content_type)) 