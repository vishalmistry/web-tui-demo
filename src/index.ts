import {
    Application,
    Button,
    CheckBox,
    Dimension,
    DosTheme,
    Frame,
    Label,
    MenuBar,
    MenuItem,
    ModalView,
    Position,
    RadioGroup,
    TextBox,
    Window,
} from 'web-tui/dist/framework';
import { DosColors, Screen } from 'web-tui/dist/screen';

const workspace = new ModalView();
const menu = new MenuBar([]);
workspace.addChild(menu);

let mainAppView: Frame | undefined;

function showLoginWindow() {
    const window = new Window('Login', 30, 10);

    const usernameLabel = new Label('Username: ');
    usernameLabel.x = 2;
    usernameLabel.y = 1;
    window.addChild(usernameLabel);

    const username = new TextBox('guest');
    username.x = Position.rightOf(usernameLabel);
    username.y = Position.topOf(usernameLabel);
    username.width = Dimension.fill().subtract(2);
    username.hasFocus = true;
    window.addChild(username);

    const passwordLabel = new Label('Password: ');
    passwordLabel.x = Position.leftOf(usernameLabel);
    passwordLabel.y = Position.bottomOf(usernameLabel).add(1);
    window.addChild(passwordLabel);

    const password = new TextBox('', true);
    password.x = Position.rightOf(passwordLabel);
    password.y = Position.topOf(passwordLabel);
    password.width = Dimension.fill().subtract(2);
    window.addChild(password);

    const loginButton = new Button('Login');
    loginButton.x = Position.center();
    loginButton.y = Position.end().subtract(1);
    window.addChild(loginButton);

    loginButton.clicked.subscribe((ev) => {
        ev.source.application.dismissModal();
        login();
    });

    workspace.application.showModal(window);
}

function showMainWindow() {
    const appFrame = new Frame('Demo');
    appFrame.frameStyle = 'double';
    appFrame.fill = true;
    appFrame.y = 1;
    appFrame.height = Dimension.fill();
    workspace.addChild(appFrame);

    const enabledCheckbox = new CheckBox('Enable all the things');
    enabledCheckbox.isChecked = true;
    enabledCheckbox.x = Position.center();
    enabledCheckbox.y = 1;
    appFrame.addChild(enabledCheckbox);

    const mainControls = new Frame('');
    mainControls.x = 1;
    mainControls.width = Dimension.fill().subtract(1);
    mainControls.y = Position.bottomOf(enabledCheckbox).add(1);
    mainControls.height = Dimension.fill().subtract(1);
    appFrame.addChild(mainControls);

    const label = new Label('Pick your favourite colour: ');
    label.x = 1;
    label.y = 1;
    mainControls.addChild(label);

    const radioGroup = new RadioGroup(['Blue', 'Green', 'Black'], 0);
    radioGroup.x = Position.leftOf(label);
    radioGroup.y = Position.bottomOf(label).add(1);
    mainControls.addChild(radioGroup);

    enabledCheckbox.checkChanged.subscribe((event) => {
        mainControls.isEnabled = event.newValue;
    });

    radioGroup.selectionChanged.subscribe((ev) => {
        let color = DosColors.blue;
        switch (ev.newValue) {
            case 1:
                color = DosColors.green;
                break;
            case 2:
                color = DosColors.black;
                break;
        }

        appFrame.theme = {
            ...DosTheme.instance,
            default: {
                ...DosTheme.instance.default,
                normal: { background: color, foreground: DosColors.brightWhite },
            },
        };
    });

    mainAppView = appFrame;
}

function logout() {
    menu.items = [
        new MenuItem('~F~ile', [
            new MenuItem('Log ~I~n', () => showLoginWindow()),
        ]),
    ];

    if (mainAppView !== undefined) {
        workspace.removeChild(mainAppView);
        mainAppView = undefined;
    }
}

function login() {
    menu.items = [
        new MenuItem('~F~ile', [
            new MenuItem('Log ~O~ut', () => logout()),
            new MenuItem('-'),
            new MenuItem('E~x~it'),
        ]),
        new MenuItem('~H~elp', [
            new MenuItem('About', () => alert('This is the web-tui demo')),
        ]),
    ];

    showMainWindow();
}

function main() {
    const app = document.getElementById('app') as HTMLDivElement;
    const screen = new Screen(app, { width: 80, height: 25 });
    screen.isResizable = false;
    screen.isMouseEnabled = true;
    screen.isKeyboardEnabled = true;
    screen.isCursorVisible = false;

    const label = new Label('Please log in via the menu above.\n' +
        'You can open the menu using Alt+F (Cmd+F on Mac)\n' +
        'or use the mouse');
    label.theme = {
        ...DosTheme.instance,
        default: {
            ...DosTheme.instance.default,
            normal: { background: DosColors.black, foreground: DosColors.grey },
        },
    };
    label.textPosition = 'center';
    label.x = Position.center();
    label.y = Position.center();
    workspace.addChild(label);

    const application = new Application(screen);
    application.showModal(workspace);
    application.start();

    logout();
}

main();
