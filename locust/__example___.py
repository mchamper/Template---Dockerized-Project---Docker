import time

from locust import HttpUser, FastHttpUser, task, between, constant

class User(HttpUser):

  # host = "http://backend"
  host = "https://backend.coffeebreakgame.com"
  wait_time = between(1,2)

  def on_start(self):
    response = self.client.post('/api/webapp/v1/auth/client/negotiate', json = {
      'api_key': '',
      'api_secret': ''
    })

    self.client.headers = {
      'Authorization': 'bearer ' + response.json()['body']['authClient']['token']['access_token']
    }

    self.client.get('/api/webapp/v1/quizzes/8143?fields=entry_pin,time_per_question,bots,ask_for_email,use_monitor,start_at,finish_at,prize_id,category_id,use_negative_points,client_id,active,show_correct_answer,show_ranking_between_questions&appends=itinerary,can_register,is_async,start_at_8601,finish_at_8601,end_at&with[prize]&with[category]&with[ranking][fields]=name,nickname,points,created_at,quiz_id&with[ranking][limit]=100')

  @task(1)
  def get_ranking(self):
    self.client.get('/api/webapp/v1/quizzes/8143/ranking?fields=name,nickname,points,created_at&limit=100')

  @task(1)
  def get_status(self):
    self.client.get('/api/webapp/v1/quizzes/8143/status')

  # @task(1)
  # def get_now(self):
  #   time.sleep(60)
  #   self.client.get('/now')
