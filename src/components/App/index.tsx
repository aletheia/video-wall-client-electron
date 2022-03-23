import * as React from 'react';
import {FC} from 'react';
import {Helmet} from 'react-helmet';
import {VideoPlayer} from '../VideoPlayer';

import {Flex} from '@chakra-ui/react';

export const App: FC = () => {
  return (
    <Flex bg="black" verticalAlign="middle" minH="100vh">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Video Wall</title>
      </Helmet>

      <VideoPlayer />
    </Flex>
  );
};
