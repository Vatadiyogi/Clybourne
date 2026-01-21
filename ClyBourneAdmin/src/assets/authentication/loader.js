window.addEventListener("load", function() {
    // Remove Loader
    var load_screen = document.getElementById("load_screen");
    if (load_screen) {
        document.body.removeChild(load_screen);
    }

    var layoutName = 'Vertical Light Menu';

    var settingsObject = {
        admin: 'Fa Fin-Advisors',
        settings: {
            layout: {
                name: layoutName,
                toggle: true,
                darkMode: false,
                boxed: true,
                logo: {
                    darkLogo: '../../assets/images/logo.svg',
                    lightLogo: '../../assets/images/logo.svg'
                }
            }
        },
        reset: false
    };

    if (settingsObject.reset) {
        localStorage.clear();
    }

    var corkThemeObject;

    if (localStorage.length === 0) {
        corkThemeObject = settingsObject;
    } else {
        var getcorkThemeObject = localStorage.getItem("theme");
        var getParseObject = JSON.parse(getcorkThemeObject);

        if (getcorkThemeObject !== null) {
            if (getParseObject.admin === 'Cork Admin Template') {
                if (getParseObject.settings.layout.name === layoutName) {
                    corkThemeObject = getParseObject;
                } else {
                    corkThemeObject = settingsObject;
                }
            } else {
                if (getParseObject.admin === undefined) {
                    corkThemeObject = settingsObject;
                }
            }
        } else {
            corkThemeObject = settingsObject;
        }
    }

    // Get Dark Mode Information i.e darkMode: true or false
    if (corkThemeObject.settings.layout.darkMode) {
        localStorage.setItem("theme", JSON.stringify(corkThemeObject));
        getcorkThemeObject = localStorage.getItem("theme");
        getParseObject = JSON.parse(getcorkThemeObject);

        if (getParseObject.settings.layout.darkMode) {
            var ifStarterKit = document.body.getAttribute('page') === 'starter-pack' ? true : false;
            document.body.classList.add('dark');
            if (ifStarterKit) {
                var logoElement = document.querySelector('.navbar-logo');
                if (logoElement) {
                    logoElement.setAttribute('src', '../../src/assets/img/logo.svg');
                }
            } else {
                logoElement = document.querySelector('.navbar-logo');
                if (logoElement) {
                    logoElement.setAttribute('src', getParseObject.settings.layout.logo.darkLogo);
                }
            }
        }
    } else {
        localStorage.setItem("theme", JSON.stringify(corkThemeObject));
        getcorkThemeObject = localStorage.getItem("theme");
        getParseObject = JSON.parse(getcorkThemeObject);

        if (!getParseObject.settings.layout.darkMode) {
            ifStarterKit = document.body.getAttribute('page') === 'starter-pack' ? true : false;
            document.body.classList.remove('dark');
            if (ifStarterKit) {
                logoElement = document.querySelector('.navbar-logo');
                if (logoElement) {
                    logoElement.setAttribute('src', '../../assets/images/logo.svg');
                }
            } else {
                logoElement = document.querySelector('.navbar-logo');
                if (logoElement) {
                    logoElement.setAttribute('src', getParseObject.settings.layout.logo.lightLogo);
                }
            }
        }
    }

    // Get Layout Information i.e boxed: true or false
    if (corkThemeObject.settings.layout.boxed) {
        localStorage.setItem("theme", JSON.stringify(corkThemeObject));
        getcorkThemeObject = localStorage.getItem("theme");
        getParseObject = JSON.parse(getcorkThemeObject);

        if (getParseObject.settings.layout.boxed) {
            if (document.body.getAttribute('layout') !== 'full-width') {
                document.body.classList.add('layout-boxed');
                var headerContainer = document.querySelector('.header-container');
                if (headerContainer) {
                    headerContainer.classList.add('container-xxl');
                }
                var middleContent = document.querySelector('.middle-content');
                if (middleContent) {
                    middleContent.classList.add('container-xxl');
                }
            } else {
                document.body.classList.remove('layout-boxed');
                headerContainer = document.querySelector('.header-container');
                if (headerContainer) {
                    headerContainer.classList.remove('container-xxl');
                }
                middleContent = document.querySelector('.middle-content');
                if (middleContent) {
                    middleContent.classList.remove('container-xxl');
                }
            }
        }
    } else {
        localStorage.setItem("theme", JSON.stringify(corkThemeObject));
        getcorkThemeObject = localStorage.getItem("theme");
        getParseObject = JSON.parse(getcorkThemeObject);

        if (!getParseObject.settings.layout.boxed) {
            if (document.body.getAttribute('layout') !== 'boxed') {
                document.body.classList.remove('layout-boxed');
                headerContainer = document.querySelector('.header-container');
                if (headerContainer) {
                    headerContainer.classList.remove('container-xxl');
                }
                middleContent = document.querySelector('.middle-content');
                if (middleContent) {
                    middleContent.classList.remove('container-xxl');
                }
            } else {
                document.body.classList.add('layout-boxed');
                headerContainer = document.querySelector('.header-container');
                if (headerContainer) {
                    headerContainer.classList.add('container-xxl');
                }
                middleContent = document.querySelector('.middle-content');
                if (middleContent) {
                    middleContent.classList.add('container-xxl');
                }
            }
        }
    }
});
