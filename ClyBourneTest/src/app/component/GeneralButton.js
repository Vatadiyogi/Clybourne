import React from 'react'

export default function GeneralButton({content, className,onClick}) {
    return (
        <>
            <button onClick={onClick} className={`${className} px-8 py-2  transition rounded`}>{content}</button>
        </>
    )
}
