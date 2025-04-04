# ai model -> data from -> their interst in learing -> uske baad course and games suggest krega -> uske hisab se vo course kitne month me ho sakta hai and daily plan bana kr dega ki kitna ho sakta hai -> daily plan and practice schedule and suggestions
from django import forms

class userForm(forms.Form):
    pass 

class RequestForm(forms.Form):
    skill_level = forms.ChoiceField(choices=[
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced')
    ])
    learning_speed = forms.ChoiceField(choices=[
        ('Slow', 'Slow'),
        ('Moderate', 'Moderate'),
        ('Fast', 'Fast')
    ])
    daily_hours = forms.IntegerField(min_value=1)
    preferred_days = forms.CharField()