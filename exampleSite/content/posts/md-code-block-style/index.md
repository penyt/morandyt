+++  
title = 'Usage of code block style in markdown'  
date = 2025-01-14T16:22:16Z  
draft = false  
tags = ['morandyt','hugo','code block']  
categories = ['morandyt','hugo']  
description = 'How to change code block style in morandyt theme?'  
tocStyle = 'order'  
author = 'pen'  
authorNote = ''  
authorImg = '/img/penlike.png'  
+++  

## Folder
Head into your `/assests/` folder  

## Command
Run:
```bash
hugo gen chromastyles --style=github > assets/css/chroma-light.css
```
&
```bash
hugo gen chromastyles --style=github-dark > assets/css/chroma-dark.css
```
{{< warning "red" "Change `github` & `github-dark` to any style you like!" >}}

## Style
Style reference: https://gohugo.io/content-management/syntax-highlighting/#style

