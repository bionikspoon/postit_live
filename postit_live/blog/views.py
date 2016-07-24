from django.shortcuts import render, get_object_or_404

from .models import Post


def post_list(request):
    posts = Post.objects.filter(status=Post.STATUS.published).order_by('published_on')
    return render(request, 'blog/post_list.html', {'posts': posts})


def post_detail(request, pk):
    post = get_object_or_404(Post, pk=pk)
    return render(request, 'blog/post_detail.html', {'post': post})
