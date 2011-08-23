# Alice

**Alice** - *(A Lightweight Independent CSS Engine)* is a micro JavaScript library focused on using hardware-accelerated capabilities (in particular CSS3 features) in modern browsers for generating high-quality, high-end visual effects.

This library and the sample code is Open Source under the [Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0.html).

**Author(s):**

* [Laurent Hasson](https://github.com/ldhasson) ([@ldhasson](http://twitter.com/ldhasson))
* [Jim Ing](https://github.com/psiborg) ([@jim_ing](http://twitter.com/jim_ing))

**Requirements:**

1. A WebKit-based browser with support for CSS3.

## How to use Alice in a web project

1. Download the source package (zip or tar.gz) and unzip it to your web folder (e.g., /var/www/html/***your project name***/js/alice).
2. Include the Alice library in your HTML using one of the following:

    a. Full library (with comments):

            <script src="js/alice/alice.js"></script>

    b. Minified version of the full library:

            <script src="js/alice/alice-min.js"></script>

    c. Specific effect(s):

            <script src="js/alice/src/alice.core.js"></script>
            <script src="js/alice/src/alice.rotate.js"></script>

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

4. Apply Alice's effects by specifying the ID of your target DIV and some parameters:

            <script type="text/javascript">
            alice.rotate("deck", "-145", {
                origin: "0% 100%", // bottom-left corner
                timing: 6000, // ms
                angle_offset: 18,
                iteration: 'infinite',
                direction: 'alternate',
                easing: "cubic-bezier(0.33333,0.6667,0.66667,1)" // bounce
            });
            </script>

   These options will apply a "card fanning" effect to your DIVs.

5. Add optional CSS styling to your DIVs:

            <style type="text/css">
            .cards {
                position: relative;
                width: 150px;
                margin: 0 auto;
            }
            .card {
                background-color: #FFFFFF;
                border: 3px solid #C0C0C0;
                border-radius: 20px;
                width: 150px;
                height: 200px;
                padding: 10px;
            }
            </style>

## More Info
* [BlackBerry WebWorks SDK for Tablet OS](http://us.blackberry.com/developers/tablet/webworks.jsp) - Getting Started guides, SDK downloads, code signing keys.
* [BlackBerry WebWorks Development Guides](http://docs.blackberry.com/en/developers/deliverables/30182/)
* [BlackBerry WebWorks Community Forums](http://supportforums.blackberry.com/t5/Web-and-WebWorks-Development/bd-p/browser_dev)
* [BlackBerry Open Source WebWorks Contributions Forums](http://supportforums.blackberry.com/t5/BlackBerry-WebWorks/bd-p/ww_con)

## Contributing Changes

To contribute code to this repository, you must [sign up as an official contributor](http://blackberry.github.com/howToContribute.html).

## Bug Reporting and Feature Requests

If you find a bug or have an enhancement request, please report an [Issue](https://github.com/blackberry/Alice/issues) and send a message (via github messages) to the author(s) to let them know that you have filed an issue.

## Disclaimer

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
