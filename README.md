# AliceJS

**AliceJS** - *(A Lightweight Independent CSS Engine)* is a micro JavaScript library focused on using hardware-accelerated capabilities (in particular CSS3 features) in modern browsers for generating high-quality, high-end visual effects.

This library and the sample code is Open Source under the [Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0.html).

**Special Attention**
As of version 0.5 there is no support for the 0.2 and 0.1 since there was a large transition in the method styling. So please if you're looking to transition to 0.5, you will need to re-write your code to fit the new method styling. Please take caution in doing so.

**Author(s):**

* [Laurent Hasson](https://github.com/ldhasson) ([@ldhasson](http://twitter.com/ldhasson), lhasson at rim dot com)
* [Jim Ing](https://github.com/psiborg) ([@jim_ing](http://twitter.com/jim_ing), jing at rim dot com)
* [Gord Tanner](https://github.com/gtanner) ([@gordtanner](http://twitter.com/gordtanner), gtanner at rim dot com)
* [Matt Lantz](https://github.com/mlantz) ([@mattylantz](http://twitter.com/mattylantz), malantz at rim dot com)

**Compatibility Issues:**
AliceJs 0.5 is not compatible with 0.2 or 0.1. We made improvements in the readability of AliceJs with objectifying the parameters of the methods. We hope this doesn't cause any confusion or stop you from trying out the new caterpillar effect!
 
**Requirements:**

1. A WebKit-based browser with support for CSS3.

## How to use AliceJS in a web project

1. Download the source package (zip or tar.gz) and unzip it to your web folder (e.g., /var/www/html/***your project name***/js/alice).
2. Include the AliceJS library in your HTML using one of the following:

    a. Full library (with comments):

            <script src="js/alice/alice.js"></script>

    b. Minified version of the full library:

            <script src="js/alice/alice-min.js"></script>

    c. Specific effect(s):

            <script src="js/alice/src/alice.core.js"></script>
            <script src="js/alice/src/alice.plugins.cheshire.js"></script>

3. Create your HTML markup. For example:

            <div id="deck" class="cards">
                <div class="card"><span>2</span></div>
                <div class="card"><span>3</span></div>
                <div class="card"><span>4</span></div>
                <div class="card"><span>5</span></div>
                <div class="card"><span>6</span></div>
                <div class="card"><span>7</span></div>
                <div class="card"><span>8</span></div>
                <div class="card"><span>9</span></div>
                <div class="card"><span>10</span></div>
                <div class="card"><span>J</span></div>
                <div class="card"><span>Q</span></div>
                <div class="card"><span>K</span></div>
                <div class="card"><span>A</span></div>
            </div>

4. Apply Alice's effects by specifying the ID of your target DIV and some parameters. These options will apply a "slide (left)" effect to your DIVs.

            <script type="text/javascript">
            var deck = document.getElementById("deck").children;

            alicejs.slide({
                elems: deck, 
                move: "left", 
                duration: {
                    "value": "1000ms",
                    "randomness": "0%",
                    "offset": "150ms"
                }
            });
            </script>

5. Add optional CSS styling to your DIVs:

            <style type="text/css">
            .card {
                float: left;
                background: transparent;
                border: 1px solid #CCC;
                border-radius: 20px;
                width: 75px;
                height: 100px;
                padding: 10px;
                text-align: center;
            }
            </style>

## More Info
* [BlackBerry WebWorks SDK for Tablet OS](http://us.blackberry.com/developers/tablet/webworks.jsp) - Getting Started guides, SDK downloads, code signing keys.
* [BlackBerry WebWorks Development Guides](http://docs.blackberry.com/en/developers/deliverables/30182/)
* [BlackBerry WebWorks Community Forums](http://supportforums.blackberry.com/t5/Web-and-WebWorks-Development/bd-p/browser_dev)
* [BlackBerry Open Source WebWorks Contributions Forums](http://supportforums.blackberry.com/t5/BlackBerry-WebWorks/bd-p/ww_con)

## Contributing Changes

To contribute code to this repository, you must [sign up as an official contributor](http://blackberry.github.com/howToContribute.html).

To build the code you will need to have [node](http://nodejs.org/) installed. To build run the following in your shell(git-bash for windows):

    ./configure

This will install the dependancies. You should then be able to run:
  
    jake

to build Alice.js

### Running tests in a headless PhantomJS instance

Those tests require _Grunt_. Also, require _grunt-contrib-qunit_ and _grunt-contrib-jasmine_ plugins.
To install all of them, type:

```
npm install -g grunt-cli
npm install grunt grunt-contrib-qunit grunt-contrib-jasmine
```

* Run **qunit** tests with the ``grunt qunit -v`` command.
* Run **jasmine** tests with the ``grunt jasmine -v`` command.
* Run **all tests** with the ``grunt test -v`` command.

## Bug Reporting and Feature Requests

If you find a bug or have an enhancement request, please report an [Issue](https://github.com/blackberry/Alice/issues) and send a message (via github messages) to the author(s) to let them know that you have filed an issue.

## Disclaimer

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
