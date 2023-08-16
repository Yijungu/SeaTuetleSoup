from django.db import models

class SeaTurtle(models.Model):
    date = models.AutoField(primary_key=True)
    story = models.TextField()
    answer_plus = models.TextField(null=True)
    problem = models.TextField()
    author = models.TextField(null=True)
    main_character = models.TextField(null=True)
    correct_answer = models.TextField(null=True)  # 변경된 필드

    def __str__(self):
        return str(self.date)

class Keyword(models.Model):
    date = models.ForeignKey(SeaTurtle, on_delete=models.CASCADE)
    word = models.CharField(max_length=200)
    alternative_word = models.CharField(max_length=200 , null=True)

    def __str__(self):
        return self.word

class SubmitProblem(models.Model):
    user = models.CharField(max_length=200)
    problem = models.TextField()
    explanation = models.TextField()

    def __str__(self):
        return self.user

class Hint(models.Model):
    
    date = models.ForeignKey(SeaTurtle, on_delete=models.CASCADE)
    hint = models.TextField()

    def __str__(self):
        return self.user
    
class QuestionLog(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.IntegerField(null=True)
    question = models.TextField()
    answer = models.TextField()
    answer2 = models.TextField(null=True)

    def __str__(self):
        return self.user