from django.shortcuts import render

from .models import Post


def post_list(request):
    posts = Post.objects.filter(status=Post.STATUS.published).order_by('published_on')
    return render(request, 'blog/post_list.html', {'posts': posts})
