<div align="center">

<img src="https://raw.githubusercontent.com/Clipteam/clipcc-gui/master/src/components/about-modal/clipcc3_logo.svg" alt="logo" width="300"/>

![](https://img.shields.io/badge/license-AGPL-blue) ![](https://img.shields.io/badge/version-3.1.2-brightgreen) ![()[https://jq.qq.com/?_wv=1027&k=HCrQYsp2]](https://img.shields.io/badge/QQ-959825608-orange) [![](https://img.shields.io/badge/Telegram-Chat-blue)](https://t.me/+KcTYDTYKzUoxZmM1)
---
</div>

ClipCC is a powerful scratch fork which adds some useful features. And it migrates a lot of features from legacy ClipCC.

# What's this
![](https://s3.jpg.cm/2021/09/20/IE4N4S.png)
ClipCC is a powerful scratch fork which adds some useful features such as new extension system, high-quality pen, stage layout and more.

**Special thanks for Ble Studio!**

# Useful Links

### [Online Editor(Stable)](https://codingclip.com/editor/stable)
### [Online Editor(Canary)](https://codingclip.com/editor/canary)
### [Offline Editor](https://github.com/Clipteam/clipcc-desktop/releases)

# What's left to be added

- Hide blocks
- JIT support
- Blockly optimization

# Building

**Please note! Please make sure you have installed [Git](https://git-scm.com/) and [Node.js](https://nodejs.org/) before building.**

In your own node environment/application:

```bash
yarn add https://github.com/Clipteam/clipcc-gui.git
```

If you want to edit/play yourself:

```bash
git clone https://github.com/Clipteam/clipcc-gui.git
cd clipcc-gui
yarn install
```

# Running

For Windows, you can directly click `start.bat` to start. Your browser will automatically be opened, please wait for it to load.

If you want to add a shortcut at the start menu, create a shortcut at `C:\ProgramData\Microsoft\Windows\Start Menu\Programs` Link to the `start.bat` file. You can change the icon to make it prettier.

For others, please open a Command Prompt or Terminal in the repository and run:

```bash
yarn start
```

Then go to [http://localhost:8601/](http://localhost:8601/) - the playground outputs the default GUI component.

## Developing alongside other Scratch repositories

### Getting another repo to point to this code

If you wish to develop `clipcc-gui` alongside other scratch repositories that depend on it, you may wish
to have the other repositories use your local `clipcc-gui` build instead of fetching the current production
version of the clipcc-gui that is found by default using `yarn install`.

Here's how to link your local `clipcc-gui` code to another project's `node_modules/clipcc-gui`.

#### Configuration

1. In your local `clipcc-gui` repository's top level:
    1. Make sure you have run `yarn install`
    2. Build the `dist` directory by running `BUILD_MODE=dist yarn run build`
    3. Establish a link to this repository by running `yarn link`

2. From the top level of each repository (such as `scratch-www`) that depends on `clipcc-gui`:
    1. Make sure you have run `yarn install`
    2. Run `yarn link clipcc-gui`
    3. Build or run the repositoriy

#### Using `yarn run watch`

Instead of `BUILD_MODE=dist yarn run build`, you can use `BUILD_MODE=dist yarn run watch` instead. This will watch for changes to your `clipcc-gui` code, and automatically rebuild when there are changes. Sometimes this has been unreliable; if you are having problems, try going back to `BUILD_MODE=dist yarn run build` until you resolve them.

#### Oh no! It didn't work!

If you can't get linking to work right, try:
* Follow the recipe above step by step and don't change the order. It is especially important to run `yarn install` _before_ `yarn link`, because installing after the linking will reset the linking.
* Make sure the repositories are siblings on your machine's file tree, like `.../.../MY_SCRATCH_DEV_DIRECTORY/clipcc-gui/` and `.../.../MY_SCRATCH_DEV_DIRECTORY/scratch-www/`.
* Consistent node.js version: If you have multiple Terminal tabs or windows open for the different Scratch repositories, make sure to use the same node version in all of them.
* If nothing else works, unlink the repositories by running `yarn unlink` in both, and start over.

## Testing
### Documentation

You may want to review the documentation for [Jest](https://facebook.github.io/jest/docs/en/api.html) and [Enzyme](http://airbnb.io/enzyme/docs/api/) as you write your tests.

See [jest cli docs](https://facebook.github.io/jest/docs/en/cli.html#content) for more options.

### Running tests

*NOTE: If you're a Windows user, please run these scripts in Windows `cmd.exe`  instead of Git Bash/MINGW64.*

Before running any test, make sure you have run `yarn install` from this (clipcc-gui) repository's top level.

#### Main testing command

To run linter, unit tests, build, and integration tests, all at once:
```bash
yarn test
```

#### Running unit tests

To run unit tests in isolation:
```bash
yarn run test:unit
```

To run unit tests in watch mode (watches for code changes and continuously runs tests):
```bash
yarn run test:unit -- --watch
```

You can run a single file of integration tests (in this example, the `button` tests):

```bash
$(yarn bin)/jest --runInBand test/unit/components/button.test.jsx
```

#### Running integration tests

Integration tests use a headless browser to manipulate the actual HTML and javascript that the repo
produces. You will not see this activity (though you can hear it when sounds are played!).

Note that integration tests require you to first create a build that can be loaded in a browser:

```bash
yarn run build
```

Then, you can run all integration tests:

```bash
yarn run test:integration
```

Or, you can run a single file of integration tests (in this example, the `backpack` tests):

```bash
$(yarn bin)/jest --runInBand test/integration/backpack.test.js
```

If you want to watch the browser as it runs the test, rather than running headless, use:

```bash
USE_HEADLESS=no $(yarn bin)/jest --runInBand test/integration/backpack.test.js
```

## Troubleshooting

### Ignoring optional dependencies

When running `yarn install`, you can get warnings about optionsl dependencies:

```
npm WARN optional Skipping failed optional dependency /chokidar/fsevents:
npm WARN notsup Not compatible with your operating system or architecture: fsevents@1.2.7
```

You can suppress them by adding the `no-optional` switch:

```
yarn install --no-optional
```

Further reading: [Stack Overflow](https://stackoverflow.com/questions/36725181/not-compatible-with-your-operating-system-or-architecture-fsevents1-0-11)

### Resolving dependencies

When installing for the first time, you can get warnings that need to be resolved:

```
npm WARN eslint-config-scratch@5.0.0 requires a peer of babel-eslint@^8.0.1 but none was installed.
npm WARN eslint-config-scratch@5.0.0 requires a peer of eslint@^4.0 but none was installed.
npm WARN scratch-paint@0.2.0-prerelease.20190318170811 requires a peer of react-intl-redux@^0.7 but none was installed.
npm WARN scratch-paint@0.2.0-prerelease.20190318170811 requires a peer of react-responsive@^4 but none was installed.
```

You can check which versions are available:

```
yarn view react-intl-redux@0.* version
```

You will need to install the required version:

```
yarn install  --no-optional --save-dev react-intl-redux@^0.7
```

The dependency itself might have more missing dependencies, which will show up like this:

```
user@machine:~/sources/scratch/clipcc-gui (491-translatable-library-objects)$ yarn install  --no-optional --save-dev react-intl-redux@^0.7
clipcc-gui@0.1.0 /media/cuideigin/Linux/sources/scratch/clipcc-gui
├── react-intl-redux@0.7.0
└── UNMET PEER DEPENDENCY react-responsive@5.0.0
```

You will need to install those as well:

```
yarn install  --no-optional --save-dev react-responsive@^5.0.0
```

Further reading: [Stack Overflow](https://stackoverflow.com/questions/46602286/npm-requires-a-peer-of-but-all-peers-are-in-package-json-and-node-modules)
### Transitions

These are names for the action which causes a state change. Some examples are:

* `START_FETCHING_NEW`,
* `DONE_FETCHING_WITH_ID`,
* `DONE_LOADING_VM_WITH_ID`,
* `SET_PROJECT_ID`,
* `START_AUTO_UPDATING`,

### How transitions relate to loading states

Like this diagram of the project state machine shows, various transition actions can move us from one loading state to another:

![Project state diagram](docs/project_state_diagram.svg)

_Note: for clarity, the diagram above excludes states and transitions relating to error handling._

#### Example

Here's an example of how states transition.

Suppose a user clicks on a project, and the page starts to load with URL https://scratch.mit.edu/projects/123456 .

Here's what will happen in the project state machine:

![Project state example](docs/project_state_example.png)

1. When the app first mounts, the project state is `NOT_LOADED`.
2. The `SET_PROJECT_ID` redux action is dispatched (from src/lib/project-fetcher-hoc.jsx), with `projectId` set to `123456`. This transitions the state from `NOT_LOADED` to `FETCHING_WITH_ID`.
3. The `FETCHING_WITH_ID` state. In src/lib/project-fetcher-hoc.jsx, the `projectId` value `123456` is used to request the data for that project from the server.
4. When the server responds with the data, src/lib/project-fetcher-hoc.jsx dispatches the `DONE_FETCHING_WITH_ID` action, with `projectData` set. This transitions the state from `FETCHING_WITH_ID` to `LOADING_VM_WITH_ID`.
5. The `LOADING_VM_WITH_ID` state. In src/lib/vm-manager-hoc.jsx, we load the `projectData` into Scratch's virtual machine ("the vm").
6. When loading is done, src/lib/vm-manager-hoc.jsx dispatches the `DONE_LOADING_VM_WITH_ID` action. This transitions the state from `LOADING_VM_WITH_ID` to `SHOWING_WITH_ID`
7. The `SHOWING_WITH_ID` state. Now the project appears normally and is playable and editable.

## Contact us

If you find a bug or have any idea, welcome to [open a issue](https://github.com/Clipteam/clipcc-gui/issues/new/choose). Also, you can contact us by [sending an email](mailto:sinangentoo.gmail.com) or join our server. We are looking forward to you feedback. 

<div align="center">
<a href="mailto:sinangentoo@gmail.com"><img src="https://img.shields.io/badge/-sinangentoo@gmail.com-D14836?style=flat-square&logo=Gmail&logoColor=white"/></a>
<a href="https://discord.gg/uuyHNBH"><img src="https://img.shields.io/badge/-Discord-5865F2?style=flat-square&logo=Discord&logoColor=white"/></a>
<a href="https://t.me/ClipCChat"><img src="https://img.shields.io/badge/-Telegram-169BD7?style=flat-square&logo=Telegram&logoColor=white"/></a>
<a href="https://jq.qq.com/?_wv=1027&k=wWQALsUb"><img src="https://img.shields.io/badge/-QQ-EB1923?style=flat-square&logo=TencentQQ&logoColor=white"/></a>
#### Copyright © *Clipteam* All rights reserved.

</div>
