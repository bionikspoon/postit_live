from django.shortcuts import render, get_object_or_404, redirect

from .forms import PostForm
from .models import Post


def post_list(request):
    posts = Post.objects.filter(status=Post.STATUS.published).order_by('published_on')
    return render(request, 'blog/post_list.html', {'posts': posts})


def post_detail(request, pk):
    post = get_object_or_404(Post, pk=pk)
    return render(request, 'blog/post_detail.html', {'post': post})


def post_new(request):
    if request.method == 'POST':
        form = PostForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.publish()
            post.save()
            return redirect('blog:post_detail', pk=post.pk)

    form = PostForm()
    return render(request, 'blog/post_edit.html', {'form': form})
