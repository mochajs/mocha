# mocha: How to Build the Site

So you wanna build the site?

## Requirements

There's two:

1.  [make](http://www.gnu.org/software/make/)
2.  [markdown](http://daringfireball.net/projects/markdown/)

### Mac OS X

Install `markdown` via Homebrew:

```sh
brew install markdown
```
    
Or download from [here](http://daringfireball.net/projects/markdown/).
        
Celebrate with tequila!  Or try to build first.  Probably want to build first.

### Linux

#### Ubuntu 14.04

1.  `sudo apt-get install build-essential` to install make.
2.  `sudo apt-get install markdown` to install markdown.
3.  That seems to do it.  It's just a Perl script, so you can [get it from here](http://daringfireball.net/projects/markdown/) otherwise.

### Windows

*To be filled in by somebody using Windows*

## Building

Execute:

```
make clean && make
```

You should now have an updated `index.html`.  Open it in your browser and proceed to tweak it until it's correct, because the compiler seem a little wonky.

