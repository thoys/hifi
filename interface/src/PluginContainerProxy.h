#pragma once
#ifndef hifi_PluginContainerProxy_h
#define hifi_PluginContainerProxy_h

#include <QObject>
#include <QRect>

#include <plugins/Forward.h>
#include <plugins/PluginContainer.h>

class PluginContainerProxy : public QObject, PluginContainer {
    Q_OBJECT
    PluginContainerProxy();
    virtual void addMenu(const QString& menuName) override;
    virtual void removeMenu(const QString& menuName) override;
    virtual QAction* addMenuItem(const QString& path, const QString& name, std::function<void(bool)> onClicked, bool checkable = false, bool checked = false, const QString& groupName = "") override;
    virtual void removeMenuItem(const QString& menuName, const QString& menuItem) override;
    virtual bool isOptionChecked(const QString& name) override;
    virtual void setIsOptionChecked(const QString& path, bool checked);
    virtual void setFullscreen(const QScreen* targetScreen, bool hideMenu = true) override;
    virtual void unsetFullscreen(const QScreen* avoidScreen = nullptr) override;
    virtual void showDisplayPluginsTools() override;
    virtual QGLWidget* getPrimarySurface() override;
    virtual bool isForeground() override;
    QRect _savedGeometry{ 10, 120, 800, 600 };

    friend class Application;
};

#endif