set(TARGET_NAME networking)

# use setup_hifi_library macro to setup our project and link appropriate Qt modules
setup_hifi_library(Network)

link_hifi_libraries(shared)

if (WIN32)
  # we need ws2_32.lib on windows, but it's static so we don't bubble it up
  target_link_libraries(${TARGET_NAME} ws2_32.lib)
endif ()

add_dependency_external_projects(tbb)

# find required dependencies
find_package(OpenSSL REQUIRED)
find_package(TBB REQUIRED)

if (APPLE AND ${OPENSSL_INCLUDE_DIR} STREQUAL "/usr/include")
  # this is a user on OS X using system OpenSSL, which is going to throw warnings since they're deprecating for their common crypto
  message(WARNING "The found version of OpenSSL is the OS X system version. This will produce deprecation warnings."
   "\nWe recommend you install a newer version (at least 1.0.1h) in a different directory and set OPENSSL_ROOT_DIR in your env so Cmake can find it.")
endif ()

include_directories(SYSTEM "${OPENSSL_INCLUDE_DIR}")

# append OpenSSL to our list of libraries to link
target_link_libraries(${TARGET_NAME} ${OPENSSL_LIBRARIES} ${TBB_LIBRARIES})

# libcrypto uses dlopen in libdl
if (UNIX)
  target_link_libraries(${TARGET_NAME} ${CMAKE_DL_LIBS})
endif (UNIX)

# append tbb includes to our list of includes to bubble
target_include_directories(${TARGET_NAME} SYSTEM PUBLIC ${TBB_INCLUDE_DIRS})
include_application_version()
