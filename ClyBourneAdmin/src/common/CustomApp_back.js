import { useEffect } from 'react';
// import PerfectScrollbar from 'perfect-scrollbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'perfect-scrollbar/css/perfect-scrollbar.css';

const CustomApp = () => {
    useEffect(() => {
        // const MediaSize = {
        //     xl: 1200,
        //     lg: 992,
        //     md: 991,
        //     sm: 576
        // };

        const Dom = {
            main: document.querySelector('html, body'),
            id: {
                container: document.querySelector("#container"),
            },
            class: {
                navbar: document.querySelector(".navbar"),
                overlay: document.querySelector('.overlay'),
                search: document.querySelector('.toggle-search'),
                searchOverlay: document.querySelector('.search-overlay'),
                searchForm: document.querySelector('.search-form-control'),
                mainContainer: document.querySelector('.main-container'),
                mainHeader: document.querySelector('.header.navbar')
            }
        };

        const categoryScroll = {
            scrollCat: function() {
                const sidebarWrapper = document.querySelectorAll('.sidebar-wrapper li.active')[0];
                const sidebarWrapperTop = sidebarWrapper.offsetTop - 12;
                setTimeout(() => {
                    const scroll = document.querySelector('.menu-categories');
                    scroll.scrollTop = sidebarWrapperTop;
                }, 50);
            }
        };

        const toggleFunction = {
            sidebar: function($recentSubmenu) {
                const sidebarCollapseEle = document.querySelectorAll('.sidebarCollapse');

                sidebarCollapseEle.forEach(el => {
                    el.addEventListener('click', function (sidebar) {
                        sidebar.preventDefault();
                        const getSidebar = document.querySelector('.sidebar-wrapper');

                        if ($recentSubmenu === true) {
                            if (document.querySelector('.collapse.submenu').classList.contains('show')) {
                                document.querySelector('.submenu.show').classList.add('mini-recent-submenu');
                                getSidebar.querySelector('.collapse.submenu').classList.remove('show');
                                getSidebar.querySelector('.collapse.submenu').classList.remove('show');
                                document.querySelector('.collapse.submenu').parentNode.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
                            } else {
                                if (Dom.class.mainContainer.classList.contains('sidebar-closed')) {
                                    if (document.querySelector('.collapse.submenu').classList.contains('recent-submenu')) {
                                        getSidebar.querySelector('.collapse.submenu.recent-submenu').classList.add('show');
                                        document.querySelector('.collapse.submenu.recent-submenu').parentNode.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'true');
                                        document.querySelector('.submenu').classList.remove('mini-recent-submenu');
                                    } else {
                                        document.querySelector('li.active .submenu').classList.add('recent-submenu');
                                        getSidebar.querySelector('.collapse.submenu.recent-submenu').classList.add('show');
                                        document.querySelector('.collapse.submenu.recent-submenu').parentNode.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'true');
                                        document.querySelector('.submenu').classList.remove('mini-recent-submenu');
                                    }
                                }
                            }
                        }
                        Dom.class.mainContainer.classList.toggle("sidebar-closed");
                        Dom.class.mainHeader.classList.toggle('expand-header');
                        Dom.class.mainContainer.classList.toggle("sbar-open");
                        Dom.class.overlay.classList.toggle('show');
                        Dom.main.classList.toggle('sidebar-noneoverflow');
                    });
                });
            },
            onToggleSidebarSubmenu: function() {
                ['mouseenter', 'mouseleave'].forEach(function(e){
                    document.querySelector('.sidebar-wrapper').addEventListener(e, function() {
                        if (document.querySelector('body').classList.contains('alt-menu')) {
                            if (document.querySelector('.main-container').classList.contains('sidebar-closed')) {
                                if (e === 'mouseenter') {
                                    document.querySelector('li.menu .submenu').classList.remove('show');
                                    document.querySelector('li.menu.active .submenu').classList.add('recent-submenu');
                                    document.querySelector('li.menu.active').querySelector('.collapse.submenu.recent-submenu').classList.add('show');
                                    document.querySelector('.collapse.submenu.recent-submenu').parentNode.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'true');
                                } else if (e === 'mouseleave') {
                                    const getMenuList = document.querySelectorAll('li.menu');
                                    getMenuList.forEach(element => {

                                        const submenuShowEle = element.querySelector('.collapse.submenu.show');

                                        if (submenuShowEle) {
                                            submenuShowEle.classList.remove('show');
                                        }

                                        const submenuExpandedToggleEle = element.querySelector('.dropdown-toggle[aria-expanded="true"]');

                                        if (submenuExpandedToggleEle) {
                                            submenuExpandedToggleEle.setAttribute('aria-expanded', 'false');
                                        }
                                        
                                    });
                                }
                            }
                        } else {
                            if (document.querySelector('.main-container').classList.contains('sidebar-closed')) {
                                if (e === 'mouseenter') {
                                    document.querySelector('li.menu .submenu').classList.remove('show');

                                    if (document.querySelector('li.menu.active .submenu')) {
                                        document.querySelector('li.menu.active .submenu').classList.add('recent-submenu');
                                        document.querySelector('li.menu.active').querySelector('.collapse.submenu.recent-submenu').classList.add('show');
                                        document.querySelector('.collapse.submenu.recent-submenu').parentNode.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'true');
                                    }
                                    
                                } else if (e === 'mouseleave') {
                                    const getMenuList = document.querySelectorAll('li.menu');
                                    getMenuList.forEach(element => {

                                        const submenuShowEle = element.querySelector('.collapse.submenu.show');

                                        if (submenuShowEle) {
                                            submenuShowEle.classList.remove('show');
                                        }


                                        const submenuExpandedToggleEle = element.querySelector('.dropdown-toggle[aria-expanded="true"]');

                                        if (submenuExpandedToggleEle) {
                                            submenuExpandedToggleEle.setAttribute('aria-expanded', 'false');
                                        }
                                        
                                    });
                                }
                            }
                        }
                        
                    });
                });

            },
            offToggleSidebarSubmenu: function () {
                // $('.sidebar-wrapper').off('mouseenter mouseleave');
            },
            overlay: function() {
                document.querySelector('#dismiss, .overlay').addEventListener('click', function () {
                    // hide sidebar
                    Dom.class.mainContainer.classList.add('sidebar-closed');
                    Dom.class.mainContainer.classList.remove('sbar-open');
                    // hide overlay
                    Dom.class.overlay.classList.remove('show');
                    Dom.main.classList.remove('sidebar-noneoverflow');
                });            
            },
            // search: function() {

            //     if (Dom.class.search) {
                    
            //         Dom.class.search.addEventListener('click', function(event) {
            //             this.classList.add('show-search');
            //             Dom.class.searchOverlay.classList.add('show');
            //             document.querySelector('body').classList.add('search-active');
            //         });
                    
            //         Dom.class.searchOverlay.addEventListener('click', function(event) {
            //             this.classList.remove('show');
            //             Dom.class.search.classList.remove('show-search');
            //             document.querySelector('body').classList.remove('search-active');
            //         });
                    
            //         document.querySelector('.search-close').addEventListener('click', function(event) {
            //             event.stopPropagation();
            //             Dom.class.searchOverlay.classList.remove('show');
            //             Dom.class.search.classList.remove('show-search');
            //             document.querySelector('body').classList.remove('search-active');
            //             document.querySelector('.search-form-control').value = ''
            //         });
            //     }

            // },
            // themeToggle: function (layoutName) {

            //     const togglethemeEl = document.querySelector('.theme-toggle');
            //     const getBodyEl = document.body;
                
            //     togglethemeEl.addEventListener('click', function() {
                    
            //         const getLocalStorage = localStorage.getItem("theme");
            //         const parseObj = JSON.parse(getLocalStorage);

            //         if (parseObj.settings.layout.darkMode) {

            //             const getObjectSettings = parseObj.settings.layout;

            //             const newParseObject = {...getObjectSettings, darkMode: false};

            //             const newObject = { ...parseObj, settings: { layout: newParseObject }}

            //             localStorage.setItem("theme", JSON.stringify(newObject))
                        
            //             const getUpdatedLocalObject = localStorage.getItem("theme");
            //             const getUpdatedParseObject = JSON.parse(getUpdatedLocalObject);

            //             if (!getUpdatedParseObject.settings.layout.darkMode) {
            //                 document.body.classList.remove('dark')
            //                 const ifStarterKit = document.body.getAttribute('page') === 'starter-pack' || document.body.getAttribute('page') === 'boxed' || document.body.getAttribute('page') === 'alt-menu' ;
            //                 if (ifStarterKit) {
            //                     localStorage.setItem('starterkitColor', 'light');
            //                 }
            //             }
                        
            //         } else {

            //             const getObjectSettings = parseObj.settings.layout;

            //             const newParseObject = {...getObjectSettings, darkMode: true};

            //             const newObject = { ...parseObj, settings: { layout: newParseObject }}

            //             localStorage.setItem("theme", JSON.stringify(newObject))

            //             const getUpdatedLocalObject = localStorage.getItem("theme");
            //             const getUpdatedParseObject = JSON.parse(getUpdatedLocalObject);

            //             if (getUpdatedParseObject.settings.layout.darkMode) {
            //                 document.body.classList.add('dark')
            //                 const ifStarterKit = document.body.getAttribute('page') === 'starter-pack' || document.body.getAttribute('page') === 'boxed' || document.body.getAttribute('page') === 'alt-menu' ;
            //                 if (ifStarterKit) {
            //                     localStorage.setItem('starterkitColor', 'dark');
            //                 }
            //             }
            //         }
            //     });
                
            // },
            onToggleNavbarShadow: function() {
                const scrollTop = window.pageYOffset;
                if (scrollTop >= 65) {
                    Dom.class.navbar.classList.add('navbar-shadow');
                } else {
                    Dom.class.navbar.classList.remove('navbar-shadow');
                }
            }
        };

        const inBuiltfunctionality = {
            // mainCatActivateScroll: function() {
            //     const ps = new PerfectScrollbar(document.querySelector('.menu-categories'), {
            //         wheelSpeed: .5,
            //         swipeEasing: !0,
            //         minScrollbarLength: 40,
            //         maxScrollbarLength: 100,
            //         suppressScrollX: !0
            //     });
            // },
            notificationScroll: function() {
                // const notificationDropdown = document.querySelectorAll('.notification-scroll');

                // notificationDropdown.forEach(nd => {
                //     const ps = new PerfectScrollbar(nd, {
                //         wheelSpeed: .5,
                //         swipeEasing: !0,
                //         minScrollbarLength: 40,
                //         maxScrollbarLength: 100,
                //         suppressScrollX: !0
                //     });
                // });
            },
            // preventScrollBody: function() {
            //     document.querySelector('.modal').addEventListener('show.bs.modal', function () {
            //         document.querySelector('html,body').classList.add('modal-open');
            //     });

            //     document.querySelector('.modal').addEventListener('hide.bs.modal', function () {
            //         document.querySelector('html,body').classList.remove('modal-open');
            //     });
            // },
            functionalDropdown: function() {
                const getDropdownElement = document.querySelectorAll('.more-dropdown .dropdown-item');

                getDropdownElement.forEach( mDropdown => {
                    mDropdown.addEventListener('click', function() {
                        document.querySelector('.more-dropdown .dropdown-toggle > span').innerText = this.getAttribute('data-value');
                    })
                });
            }
        };

        categoryScroll.scrollCat();

        if (document.body.classList.contains('alt-menu')) {
            toggleFunction.sidebar(true);
            toggleFunction.onToggleSidebarSubmenu();
        } else {
            toggleFunction.sidebar(false);
        }
        
        toggleFunction.overlay();
        // toggleFunction.search();
        // toggleFunction.themeToggle('default');
        // inBuiltfunctionality.mainCatActivateScroll();
        inBuiltfunctionality.notificationScroll();
        // inBuiltfunctionality.preventScrollBody();
        inBuiltfunctionality.functionalDropdown();

        // Waves.init();

        window.addEventListener('scroll', toggleFunction.onToggleNavbarShadow);

        // Hotkeys can be configured similarly

        return () => {
            window.removeEventListener('scroll', toggleFunction.onToggleNavbarShadow);
        };
    }, []);
};

export default CustomApp;
