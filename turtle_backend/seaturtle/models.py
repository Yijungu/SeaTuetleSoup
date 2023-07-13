from django.db import models

class SeaTurtle(models.Model):
    date = models.AutoField(primary_key=True)
    story = models.TextField()
    problem = models.TextField()
    correct_answer = models.TextField(null=True)  # 변경된 필드

    def __str__(self):
        return str(self.date)

class Keyword(models.Model):
    date = models.ForeignKey(SeaTurtle, on_delete=models.CASCADE)
    word = models.CharField(max_length=200)

    def __str__(self):
        return self.word

class SubmitProblem(models.Model):
    user = models.CharField(max_length=200)
    problem = models.TextField()
    explanation = models.TextField()

    def __str__(self):
        return self.user
