# to-do
A to-do app project (The Odin Project curriculum)

## Webpack
### Setting up
I followed [this tutorial](https://webpack.js.org/guides/getting-started/) to set up webpack.

### Development mode
When creating webpack.config.js, I set mode to be development. That way, webpack doesn't minify the output code and it's easier to debug.

### npm run watch
When you update your files, in order for webpack to update the view, you need to run the following command from the project directory:
`npx webpack`

In order to not do this everytime, you can run this code once:
`npx webpack --watch`

You can also update `package.json` file so that `scripts` include this line:
`"watch": "webpack --progress --watch"`

After that, `npm run watch` to track the changes in files.

## JavaScript
### Removing nodes
In order to be able to delete complex nodes with lots of children and children's children, use this recursive function:
```javascript
function removeNode(node) {
    while (node.firstChild) {
        removeNode(node.firstChild);
    }
    node.remove();
}
```
After discussion on Discord, I've been assured that using innerHTML set to an empty string is fine in this case and not a cause for security concerns.


### Slide-out menu animation
I wanted to make the menu slide out when hidden. However, CSS rule for slide-in animation didn't allow for using another CSS rule to achieve this effect. Instead, I used `animate()` in JS. The first parameter lists keyframes, the second sets duration of the animation. I used `setTimeout()` so that the menu wouldn't disappear before the animation was completed.
```javascript
    elements.menuPanel.animate([
        { transform: 'translateX(0px)' },
        { transform: 'translateX(-305px)' },
    ], {
        duration: 300,
    });
    setTimeout(() => {
        removeNode(elements.menuPanel);
    }, 300);
```

## CSS
### Flex-shrink, flex-grow and flex-basis
[Super clear tutorial](https://medium.com/@tiffnogueira/understanding-flex-shrink-flex-grow-and-flex-basis-and-using-these-properties-to-their-full-e4b4afd2c930).