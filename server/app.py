from flask import Flask
from flask_cors import CORS
from routes import routes

app = Flask(__name__)
CORS(app)

# Register the Blueprint
app.register_blueprint(routes.blueprint, url_prefix="/")

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
