#!/usr/bin/env bash

# Install CMake compiler and build tools

if [ "$(uname)" == "Darwin" ]; then
    # Do something under Mac OS X platform        
    brew install cmake
    brew install openssl
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
    # Do something under GNU/Linux platform
    sudo apt-get install cmake
    sudo apt-get install libssl-dev
elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW32_NT" ]; then
    # Do something under 32 bits Windows NT platform
elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW64_NT" ]; then
    # Do something under 64 bits Windows NT platform
fi
