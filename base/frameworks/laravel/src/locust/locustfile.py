from locust import HttpUser, task

class User(HttpUser):

    host = "http://localhost"

    @task
    def index(self):
        self.client.get("/")
