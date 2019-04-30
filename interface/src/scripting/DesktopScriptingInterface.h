//
//  DesktopScriptingInterface.h
//  interface/src/scripting
//
//  Created by David Rowe on 25 Aug 2015.
//  Copyright 2015 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

#ifndef hifi_DesktopScriptingInterface_h
#define hifi_DesktopScriptingInterface_h

#include <QObject>
#include <QtScript/QScriptValue>

#include <DependencyManager.h>

#include "InteractiveWindow.h"

/**jsdoc
 * @namespace Desktop
 *
 * @hifi-interface
 * @hifi-client-entity
 * @hifi-avatar
 *
 * @property {number} width - Physical width of screen(s) including task bars and system menus
 * @property {number} height - Physical height of screen(s) including task bars and system menus
 * @property {number} ALWAYS_ON_TOP - InteractiveWindow flag for always showing a window on top
 * @property {number} CLOSE_BUTTON_HIDES - InteractiveWindow flag for hiding the window instead of closing on window close by user
 */

/**jsdoc
 * The presentation mode determines on which desktop a window is rendered.
 * @typedef Desktop.PresentationMode
 * @property {number} VIRTUAL - Virtual presentation mode is using the rendered desktop
 * @property {number} NATIVE - Native presentation mode is using the native desktop
 */

class DesktopScriptingInterface : public QObject, public Dependency {
    Q_OBJECT
    Q_PROPERTY(int width READ getWidth)
    Q_PROPERTY(int height READ getHeight)

    Q_PROPERTY(QVariantMap PresentationMode READ getPresentationMode CONSTANT FINAL)
    Q_PROPERTY(int ALWAYS_ON_TOP READ flagAlwaysOnTop CONSTANT FINAL)
    Q_PROPERTY(int CLOSE_BUTTON_HIDES READ flagCloseButtonHides CONSTANT FINAL)

public:
    Q_INVOKABLE void setHUDAlpha(float alpha);

    /**jsdoc
     * Load a QML file into the virtual desktop
     * 
     * @function Desktop.show
     * @param {string} path - Path to the QML file
     * @param {string} title - title of the virtual window
     */
    Q_INVOKABLE void show(const QString& path, const QString& title);

    /**jsdoc
     * Create an instance of the InteractiveWindow, which is a multi purpose QML window that can toggle between native and virtual modes.
     * 
     * @function Desktop.createWindow
     * @param {string} sourceUrl - Url to the source QML file
     * @param {InteractiveWindow.Properties} properties - Interactive window initial properties
     * @return {InteractiveWindow}
     */
    Q_INVOKABLE InteractiveWindowPointer createWindow(const QString& sourceUrl, const QVariantMap& properties = QVariantMap());

    /**jsdoc
     * Physical width of screen(s) including task bars and system menus
     * @function Desktop.getWidth
     * @return {number}
     */
    int getWidth();

    /**jsdoc
     * Physical height of screen(s) including task bars and system menus
     * @function Desktop.getHeight
     * @return {number}
     */
    int getHeight();


private:
    static int flagAlwaysOnTop() { return AlwaysOnTop; }
    static int flagCloseButtonHides() { return CloseButtonHides; }

    Q_INVOKABLE static QVariantMap getPresentationMode();
};


#endif // hifi_DesktopScriptingInterface_h
