# MapPlayHouse

### tailwindcss 사용

#### HeadlessUI

### Form Validation 은 Formik / Yup 사용

### Swiper

https://swiperjs.com/react

## Routes

## NPM Scripts

- 🔥 `start` - run development server
- 🔧 `dev` - run development server
- 🔧 `build` - build web app for production
- 📱 `build-capacitor-ios` - build app and copy it to iOS capacitor project
- 📱 `build-capacitor-android` - build app and copy it to Android capacitor project

## WebPack

There is a webpack bundler setup. It compiles and bundles all "front-end" resources. You should work only with files located in `/src` folder. Webpack config located in `build/webpack.config.js`.

Webpack has specific way of handling static assets (CSS files, images, audios). You can learn more about correct way of doing things on [official webpack documentation](https://webpack.js.org/guides/asset-management/).

## PWA

This is a PWA. Don't forget to check what is inside of your `service-worker.js`. It is also recommended that you disable service worker (or enable "Update on reload") in browser dev tools during development.

## Capacitor

This project created uses Capacitor. Check out [official Capacitor documentation](https://capacitorjs.com) for more examples and usage examples.

## Assets

Assets (icons, splash screens) source images located in `assets-src` folder. To generate your own icons and splash screen images, you will need to replace all assets in this directory with your own images (pay attention to image size and format), and run the following command in the project directory:

```
framework7 assets
```

Or launch UI where you will be able to change icons and splash screens:

```
framework7 assets --ui
```

## Capacitor Assets

Capacitor assets are located in `resources` folder which is intended to be used with `cordova-res` tool. To generate mobile apps assets run in terminal:

```
npx cordova-res
```

Check out [official cordova-res documentation](https://github.com/ionic-team/cordova-res) for more usage examples.

## Documentation & Resources

- [Framework7 Core Documentation](https://framework7.io/docs/)

- [Framework7 React Documentation](https://framework7.io/react/)

- [Framework7 Icons Reference](https://framework7.io/icons/)
- [Community Forum](https://forum.framework7.io)

## Support Framework7

Love Framework7? Support project by donating or pledging on patreon:
https://patreon.com/vladimirkharlampidi
