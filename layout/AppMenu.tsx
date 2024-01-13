/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '../types/types';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model: AppMenuItem[] = [
        {
            label: 'Home',
            items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' },
                { label: 'Permissions', icon: 'pi pi-fw pi-id-card', to: '/permissions' },
                { label: 'Roles', icon: 'pi pi-fw pi-id-card', to: '/roles' },
                { label: 'Users', icon: 'pi pi-fw pi-id-card', to: '/users' },
                { label: 'Profiles', icon: 'pi pi-fw pi-id-card', to: '/profiles' }
            ]
        },
        {
            label: 'MANAGE',
            items: [
                { label: 'Categories', icon: 'pi pi-fw pi-id-card', to: '/categories' },
                { label: 'Sub Categories', icon: 'pi pi-fw pi-id-card', to: '/sub-categories' },
                { label: 'Sub Sub Categories', icon: 'pi pi-fw pi-id-card', to: '/sub-sub-categories' },
                { label: 'Products', icon: 'pi pi-fw pi-id-card', to: '/products' },
                { label: 'Sizes', icon: 'pi pi-fw pi-id-card', to: '/size' },
                { label: 'Blogs', icon: 'pi pi-fw pi-id-card', to: '/blogs' },
                { label: 'Sub Blogs', icon: 'pi pi-fw pi-id-card', to: '/sub-blogs' },
                { label: 'Orders', icon: 'pi pi-fw pi-id-card', to: '/orders' },
                { label: 'Coupons', icon: 'pi pi-fw pi-id-card', to: '/coupons' },
                { label: 'Delivery Costs', icon: 'pi pi-fw pi-id-card', to: '/delivery-costs' }
            ]
        },
        {
            label: 'Extra',
            icon: 'pi pi-fw pi-briefcase',
            to: '/pages',
            items: [
                {
                    label: 'Site Info',
                    icon: 'pi pi-fw pi-circle-off',
                    to: '/siteinfo'
                },
                {
                    label: 'Slider',
                    icon: 'pi pi-fw pi-pencil',
                    to: '/slider'
                },
                {
                    label: 'Home Banner',
                    icon: 'pi pi-fw pi-pencil',
                    to: '/home-banner'
                },
                {
                    label: 'Payment Methods',
                    icon: 'pi pi-fw pi-pencil',
                    to: '/payment-method'
                },
                {
                    label: 'Shipping',
                    icon: 'pi pi-fw pi-pencil',
                    to: '/shipping'
                },
                {
                    label: 'Coupon Banner',
                    icon: 'pi pi-fw pi-calendar',
                    to: '/coupon-banner'
                }
            ]
        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
