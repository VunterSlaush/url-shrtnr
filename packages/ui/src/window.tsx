import React from 'react';

interface Props {
    className?: string;
    children?: React.ReactNode;
}

export const Window: React.FC<Props> = ({ children }) => {

    return (
        <div className="ui:w-full">
            <div className="ui:h-[37px] ui:bg-[#d1d1d1] ui:rounded-t-xl relative">
                <div className="ui:h-[10px] ui:w-[10px] ui:bg-red-500 ui:rounded-full ui:absolute ui:top-[50%] ui:left-[10px] ui:-translate-y-[50%]"></div>
                <div className="ui:h-[10px] ui:w-[10px] ui:bg-orange-500 ui:rounded-full ui:absolute ui:top-[50%] ui:left-[30px] ui:-translate-y-[50%]"></div>
                <div className="ui:h-[10px] ui:w-[10px] ui:bg-green-500 ui:rounded-full ui:absolute ui:top-[50%] ui:left-[50px] ui:-translate-y-[50%]"></div>
            </div>
            <div className="ui:w-full ui:h-auto ui:bg-white ui:rounded-b-xl ui:shadow-lg">
                {children}
            </div>
        </div>

    );
};


