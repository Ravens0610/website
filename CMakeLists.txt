cmake_minimum_required(VERSION 3.15)
project(nerovi-website)

set(NEROVI_VERSION "1.0.0")

add_custom_command(OUTPUT "${PROJECT_SOURCE_DIR}/node_modules"
  COMMAND npm install
  WORKING_DIRECTORY "${PROJECT_SOURCE_DIR}"
  COMMENT "Installing Node.JS package dependencies")
add_custom_target(depinstall ALL DEPENDS "${PROJECT_SOURCE_DIR}/node_modules")

add_custom_command(OUTPUT "${PROJECT_SOURCE_DIR}/.nuxt"
  COMMAND npm run build
  WORKING_DIRECTORY "${PROJECT_SOURCE_DIR}"
  COMMENT "Building Node.JS package"
  MAIN_DEPENDENCY "${PROJECT_SOURCE_DIR}/node_modules")
add_custom_target(build ALL DEPENDS "${PROJECT_SOURCE_DIR}/.nuxt")

add_custom_command(OUTPUT "${PROJECT_BUILD_DIR}/nerovi-${NEROVI_VERSION}.tgz"
  COMMAND npm pack "${PROJECT_SOURCE_DIR}"
  WORKING_DIRECTORY "${PROJECT_BUILD_DIR}"
  COMMENT "Packaging Node.JS package"
  MAIN_DEPENDENCY "${PROJECT_SOURCE_DIR}/.nuxt")
add_custom_target(package ALL DEPENDS "${PROJECT_SOURCE_DIR}/node_modules" "${PROJECT_SOURCE_DIR}/.nuxt" "${PROJECT_BUILD_DIR}/nerovi-${NEROVI_VERSION}.tgz")
