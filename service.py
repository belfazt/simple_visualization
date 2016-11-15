from flask import Flask, json, request, render_template
from invalid_usage import InvalidUsage

app = Flask(__name__)

info = []
acceleration = [0, 0, 0]
punches = { 'good_punches': 0, 'bad_punches': 0 }

@app.route("/")
def hello():
    return "Hello World!"

@app.route("/info", methods = ['GET'])
def read_info():
  return json.jsonify(info)

@app.route("/acceleration", methods = ['GET'])
def read_acceleration():
  return json.jsonify(acceleration)

@app.route("/punches")
def read_punches():
  return json.jsonify(punches)

@app.route("/info", methods = ['POST'])
def add_info():
  try:
    global info
    global acceleration
    global punches
    data = request.get_json(silent=True)
    if len(info) > 50:
      info = info[len(info) / 2:]
    info.append([data['x'], data['y'], data['z']])
    acceleration = [data['x_accel'], data['y_accel'], data['z_accel']]
    punches['good_punches'] = data['good_punches']
    punches['bad_punches'] = data['bad_punches']
    return read_info()
  except Exception as e:
    return json.jsonify(InvalidUsage(str(e)).to_dict())

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
