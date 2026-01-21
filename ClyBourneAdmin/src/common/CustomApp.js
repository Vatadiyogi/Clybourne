import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'perfect-scrollbar/css/perfect-scrollbar.css';

const CustomApp = () => {
    useEffect(() => {
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

        const handleClick = function(event) {
            event.preventDefault();

            Dom.class.mainContainer.classList.toggle("sidebar-closed");
            Dom.class.mainHeader.classList.toggle('expand-header');
            Dom.class.mainContainer.classList.toggle("sbar-open");
            Dom.class.overlay.classList.toggle('show');
            Dom.main.classList.toggle('sidebar-noneoverflow');
        };

        const handleSidebar = function($recentSubmenu) {
            const sidebarCollapseEle = document.querySelectorAll('.sidebarCollapse');
            // console.log('sidebarCollapse elements:', sidebarCollapseEle);

            sidebarCollapseEle.forEach(el => {
                // console.log('Adding event listener to:', el);
                el.addEventListener('click', handleClick);
            });
        };

        handleSidebar(false);

        const handleOverlayClick = () => {
            Dom.class.mainContainer.classList.add('sidebar-closed');
            Dom.class.mainContainer.classList.remove('sbar-open');
            Dom.class.overlay.classList.remove('show');
            Dom.main.classList.remove('sidebar-noneoverflow');
        };

        const overlayElements = document.querySelectorAll('#dismiss, .overlay');
        overlayElements.forEach(el => {
            el.addEventListener('click', handleOverlayClick);
        });

        const handleNavbarShadow = () => {
            const scrollTop = window.pageYOffset;
            if (scrollTop >= 65) {
                Dom.class.navbar.classList.add('navbar-shadow');
            } else {
                Dom.class.navbar.classList.remove('navbar-shadow');
            }
        };

        window.addEventListener('scroll', handleNavbarShadow);

        return () => {
            // Cleanup all event listeners on unmount
            window.removeEventListener('scroll', handleNavbarShadow);
            const sidebarCollapseEle = document.querySelectorAll('.sidebarCollapse');
            sidebarCollapseEle.forEach(el => {
                el.removeEventListener('click', handleClick);
            });
            overlayElements.forEach(el => {
                el.removeEventListener('click', handleOverlayClick);
            });
        };
    }, []);

    return null;
};

export default CustomApp;
