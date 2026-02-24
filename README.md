# Morandyt

![screenshot](https://github.com/penyt/morandyt/blob/edd90e5846f37fda036f8ddfaf6a9d9d784d7498/images/screenshot.png)

**Morandyt** is a minimal Hugo theme featuring soft Morandi-inspired color palettes.

[Click here to see official theme page](https://themes.gohugo.io/themes/morandyt/)

## Generate a hugo site folder (named "mywebsite")

`hugo new site mywebsite`

default folder structure:  
.  
├── archetypes  
│   └── default.md  
├── assets  
├── content  
├── data  
├── hugo.toml  
├── i18n  
├── layouts  
├── static  
└── themes

## 📦 Installation

First, navigate to your website's directory.

```
cd mywebsite
```

Add this theme as a Git submodule:

```bash
git submodule add https://github.com/penyt/morandyt.git themes/morandyt
```

folder structure:  
.  
├── archetypes  
│   └── default.md  
├── assets  
├── content  
├── data  
├── hugo.toml  
├── i18n  
├── layouts  
├── resources  
├── static  
└── themes  
 └── morandyt

Then, in your hugo.toml, `nano hugo.toml`, set:

```toml
theme = "morandyt"
```

Here's an example [hugo.toml](https://github.com/penyt/morandyt/blob/main/exampleSite/hugo.toml).

You can preview the example site [here](https://morandyt-demo.penyt.com) or locally with:

```sh
hugo server -s themes/morandyt/exampleSite --themesDir ../..
```

### Get latest theme version

```sh
git submodule update --remote --merge
```

## 📝 Documentation

More documentation will be available soon.

## 📄 License

MIT
