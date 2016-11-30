from flask import Flask, json, request, render_template
from invalid_usage import InvalidUsage

app = Flask(__name__)

info = []
punches = { 'good_punches': 0, 'bad_punches': 0 }
mass = 1

@app.route("/")
def hello():
    return "Hello World!"

@app.route("/info", methods = ['GET'])
def read_info():
  return json.jsonify(info)

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
    if len(info) > 300:
      info = info[len(info) / 2:]
    info.append([data['x'], data['y'], data['z']])
    punches['good_punches'] = data['good_punches']
    punches['bad_punches'] = data['bad_punches']
    return read_info()
  except Exception as e:
    return json.jsonify(InvalidUsage(str(e)).to_dict())

@app.route("/mass", methods = ['GET'])
def read_mass():
  return json.jsonify({'mass': mass})

@app.route("/mass/<int:mass2>", methods = ['POST'])
def define_mass(mass2):
  global mass
  mass = mass2
  return read_mass()

@app.route("/info", methods = ['DELETE'])
def delete_info():
  global info
  info = []
  return read_info()

@app.route("/visualize")
def visualize():
  return render_template("viz.html")

if __name__ == "__main__":
    app.run(host='127.0.0.1', debug=False, threaded=True)
