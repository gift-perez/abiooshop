import { SVGAttributes } from 'react';

/** ABIIO SHOP mark: a filled shopping bag. Colour comes from `fill-current` / text colour. */
export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8 7V6a4 4 0 0 1 8 0v1h3a1 1 0 0 1 1 1.08l-1 13A1 1 0 0 1 18 22H6a1 1 0 0 1-1-.92l-1-13A1 1 0 0 1 5 7h3Zm2 0h4V6a2 2 0 1 0-4 0v1Z"
            />
        </svg>
    );
}
