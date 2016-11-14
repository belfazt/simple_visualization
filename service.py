from flask import Flask, json, request, render_template
from invalid_usage import InvalidUsage

app = Flask(__name__)

info = []

@app.route("/")
def hello():
    return "Hello World!"

@app.route("/info", methods = ['GET'])
def read_info():
  return json.jsonify(info)

@app.route("/info", methods = ['POST'])
def add_info():
  try:
    global info
    data = request.get_json()
    info.append([data['x'], data['y'], data['z']])
    return read_info()
  except Exception as e:
    return json.jsonify(InvalidUsage('error').to_dict())

@app.route("/info", methods = ['DELETE'])
def delete_info():
  global info
  info = []
  return read_info()

@app.route("/visualize")
def visualize():
  return render_template("viz.html")

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
