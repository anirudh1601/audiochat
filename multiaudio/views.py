from django.shortcuts import render

# Create your views here.
def audio(request):
    return render(request,'multiaudio/a.html')