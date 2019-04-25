#  Created by Bradley Austin Davis on 2017/09/02
#  Copyright 2013-2017 High Fidelity, Inc.
#
#  Distributed under the Apache License, Version 2.0.
#  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
#

# Sets the QT_CMAKE_PREFIX_PATH and QT_DIR variables
# Also enables CMAKE_AUTOMOC and CMAKE_AUTORCC
macro(setup_qt)
    # if we are in a development build and QT_CMAKE_PREFIX_PATH is specified
    # then use it,
    # otherwise, use the vcpkg'ed version
    if (RELEASE_TYPE STREQUAL "DEV" AND DEFINED ENV{QT_CMAKE_PREFIX_PATH})
        message("Development build and QT_CMAKE_PREFIX_PATH is defined in environment - using this path for Qt")
        set(QT_CMAKE_PREFIX_PATH $ENV{QT_CMAKE_PREFIX_PATH})
    else()
        message(" Using vcpkg'ed version of Qt")
    endif()

    # figure out where the qt dir is
    get_filename_component(QT_DIR "${QT_CMAKE_PREFIX_PATH}/../../" ABSOLUTE)

    if (WIN32)
        # windows shell does not like backslashes expanded on the command line,
        # so convert all backslashes in the QT path to forward slashes
        string(REPLACE \\ / QT_CMAKE_PREFIX_PATH ${QT_CMAKE_PREFIX_PATH})
        string(REPLACE \\ / QT_DIR ${QT_DIR})
    endif()

    if (NOT EXISTS "${QT_CMAKE_PREFIX_PATH}/Qt5Core/Qt5CoreConfig.cmake")
        message(FATAL_ERROR "Unable to locate Qt cmake config in ${QT_CMAKE_PREFIX_PATH}")
    endif()

    message(STATUS "The Qt build in use is: \"${QT_DIR}\"")

    # Instruct CMake to run moc automatically when needed.
    set(CMAKE_AUTOMOC ON)

    # Instruct CMake to run rcc automatically when needed
    set(CMAKE_AUTORCC ON)

    if (WIN32)
        add_paths_to_fixup_libs("${QT_DIR}/bin")
    endif ()
message("=========================================================================SetupQtMake")
message(${QT_CMAKE_PREFIX_PATH})

endmacro()