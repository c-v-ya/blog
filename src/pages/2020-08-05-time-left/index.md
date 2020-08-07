---
path: "/2020-08-05-time-left"
date: "2020-08-05"
title: "Simple React app to track time"
author: "Constantine Yarushkin"
description: "My first live useful React app"
image: "aron-visuals-BXOXnQ26B7o-unsplash.jpg"
tags: "showdev, react, beginners"
---

_Photo by_ [_Aron Visuals_](https://unsplash.com/@aronvisuals?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText) _on_ [_Unsplash_](https://unsplash.com/?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText)

# Idea

Every day I track time on tasks I'm working on. My typical flow is write down a task number, description and time spent in a text document right after I'm done with that task. So at the end of the day I can just copy-paste that info in task tracker. But sometimes I sit there calculating how many hours of work I have left. Did I overwork? Or maybe I have couple of hours left to start another task? And that's when I had an idea to write an app that would track all of it for me.

After I [had a grasp](https://dev.to/c_v_ya/django-react-redux-and-jwt-3jn4) at React and Redux I thought "that would be a great side project!". And after spending around 48 hours I can say it was worth it! I learned and once more repeated a lot of things. Here goes a brief description of my work process. And you can try the app [here](https://time-left.netlify.app/). It works without any backend (that's intentional). So everything is stored in your browser. Hence, if you change devices/browsers the tasks won't be there.

# Work Process

I started with an idea to just display and edit my working hours (or total time) and to add tasks. So I'd need a couple of inputs and a button. That was easy enough. Then I needed to store those tasks in a local storage and display them. It didn't took long. But afterwards I realized that I need to edit the tasks. As a side note, I didn't want to use Redux here. And was hoping to lean on state. Unfortunately, that didn't fly. As I soon bumped into problems of updating the total time when the tasks are changing.

So came the Redux. At first I went with updating total time when the task added or edited. But when the task is edited hours and minutes can be both added or subtracted. So the logic became too complicated, meaning there was something wrong with this approach. Next attempt was to just sum all of the hours and minutes of every task on task add/edit and subtract that value from the total time. This time my code was much cleaner.

Also there were couple moments when I was like "oh, fck, I also need to _%edit/add new feature%_". But that taught me to think a little deeper (but not too deep) about a feature I'm about to implement.

# TL:DR

If you're doing something mundane every day - think of ways you can automate that. And then how to actually implement your idea.

It's okay to think "I might need a library/plugin/technology X" (in my case Redux) but try to work it out without that. And add that library later when you sure your code/logic get's too complicated.

Try to think about a feature you're about to implement a little bit longer, give it some time. Maybe you'll see things you didn't notice at first.

---

Thank you for reading! If you've tried this little app and it was helpful - I'm really glad (and proud :wolf:). If you've noticed any issues or bugs, please submit them on the [project's page](https://github.com/c-v-ya/time-left). If you want to see any features.. well, submit them too but I can't promise I'll implement them.
