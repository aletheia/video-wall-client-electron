import React, { FC } from 'react';
import {Center} from '@chakra-ui/react'

export const VideoPlayer: FC = () => {

    return (
        <Center>
            <video controls autoPlay width="100%" height="100%">
            <source src="./static/sample.mp4" type="video/mp4" />
            </video>
        </Center>
    );
}
    
