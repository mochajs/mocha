# mocha: How to Build the Site

So you wanna build the site?

## Requirements

There's two:

1.  [make](http://www.gnu.org/software/make/)
2.  [markdown](http://daringfireball.net/projects/markdown/)

### Mac OS X

1.  Get [Homebrew](http://brew.sh).  Install it.  Great.  Command at the time of writing was:

    ```sh
    ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"
    ```

2.  Assert `make` exists by executing:

    ```sh
    which make
    ```

3.  If `which` did not return a path to the `make` executable, choose your own adventure:  
  
      - Download & install "Command Line Tools for Xcode" which is [buried somewhere in here](https://developer.apple.com/downloads/index.action#), and requires an Apple ID, or
      
      - Install `make` via Homebrew:
    
        ```sh
        brew install make
        ```
  
    *Homebrew will not let you install `make` via the second method if it is already installed via the first method.*

4.  Install `markdown`:
    
    ```sh
    brew install markdown
    ```
    
    Or download from [here](http://daringfireball.net/projects/markdown/).
        
5.  Celebrate with tequila!  Or try to build first.  Probably want to build first.

### Linux

#### Ubuntu 14.04

You should have `make`, so you need `markdown`.

1.  `sudo apt-get install markdown`

2.  That seems to do it.  It's just a Perl script, so you can [get it from here](http://daringfireball.net/projects/markdown/) otherwise.

### Windows

*To be filled in by somebody using Windows*

## Building

Execute:

```
make clean && make
```

You should now have an updated `index.html`.  Open it in your browser and proceed to tweak it until it's correct, because the compiler seem a little wonky.

