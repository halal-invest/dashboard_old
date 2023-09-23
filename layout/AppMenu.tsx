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
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'MANAGE',
            items: [
                { label: 'Categories', icon: 'pi pi-fw pi-id-card', to: '/categories' },
                { label: 'Sub Categories', icon: 'pi pi-fw pi-id-card', to: '/sub-categories' },
                { label: 'Products', icon: 'pi pi-fw pi-id-card', to: '/products' },
                { label: 'Blogs', icon: 'pi pi-fw pi-id-card', to: '/blogs' },
                { label: 'Sub Blogs', icon: 'pi pi-fw pi-id-card', to: '/sub-blogs' },
                { label: 'Orders', icon: 'pi pi-fw pi-id-card', to: '/orders' },
                { label: 'Profile', icon: 'pi pi-fw pi-id-card', to: '/profile' },
                { label: 'Users', icon: 'pi pi-fw pi-id-card', to: '/users' },
                { label: 'Coupons', icon: 'pi pi-fw pi-id-card', to: '/coupons' },

            ]
        },
        {
            label: 'Extra',
            icon: 'pi pi-fw pi-briefcase',
            to: '/pages',
            items: [

                {
                    label: 'Banner',
                    icon: 'pi pi-fw pi-pencil',
                    to: 'banner'
                },
                {
                    label: 'Coupon Banner',
                    icon: 'pi pi-fw pi-calendar',
                    to: '/pages/timeline'
                },
                {
                    label: 'Shipping',
                    icon: 'Payment Methods',
                    to: '/pages/notfound'
                },
                {
                    label: 'Site Info',
                    icon: 'pi pi-fw pi-circle-off',
                    to: '/pages/empty'
                }
            ]
        },

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
