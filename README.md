I used a k-means algorithim. And then a `Euclidean` function (pull this from AI help as it's not something i've done or ever really doing).
The performance, and way i'm doing things is a bit, mundance and simple you'd do it a bit different for example, the radius distance is hardcoded 400 value and a 5% of the loweest pop locations, to save compute time essentially.

Happy to talk more through it. Some functions are AI generated. Some i've written, the overal goal and direction is driven by me.

To setup:

`npm i` to install 

there's 2 directories, the `src` directory which will look for your 2 `csv` files to run the actual algorithim & `my-react-router-app` to run a dasbhoard view to just some random vis (uses react + tailwind really basic mundane stuff).


To run this:

* `npm install` at the root
* `cd my-react-router-app` and `npm install`
* Then you want to go `cd ..` back into your root
* Get your `csv` files, and pull them into the `root` level of the project
* Run `npm run start` this will run the algorithim and output a `JSON` file
* run `npm run start-frontend` to run frontend
* Visit `http://localhost:5173/` in your webbrowser to view


Any problems let me know.
