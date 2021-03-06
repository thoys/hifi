//
//  AnimationCache.h
//  libraries/animation/src/
//
//  Created by Andrzej Kapolka on 4/14/14.
//  Copyright (c) 2014 High Fidelity, Inc. All rights reserved.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

#ifndef hifi_AnimationCache_h
#define hifi_AnimationCache_h

#include <QtCore/QRunnable>
#include <QtScript/QScriptEngine>
#include <QtScript/QScriptValue>

#include <DependencyManager.h>
#include <FBXReader.h>
#include <ResourceCache.h>

class Animation;

typedef QSharedPointer<Animation> AnimationPointer;

/// Scriptable interface for FBX animation loading.
class AnimationCache : public ResourceCache, public Dependency  {
    Q_OBJECT
    SINGLETON_DEPENDENCY

public:
    Q_INVOKABLE AnimationPointer getAnimation(const QString& url) { return getAnimation(QUrl(url)); }
    Q_INVOKABLE AnimationPointer getAnimation(const QUrl& url);

protected:
    
    virtual QSharedPointer<Resource> createResource(const QUrl& url,
                const QSharedPointer<Resource>& fallback, bool delayLoad, const void* extra);
private:
    AnimationCache(QObject* parent = NULL);
    virtual ~AnimationCache() { }

};

Q_DECLARE_METATYPE(AnimationPointer)

/// An animation loaded from the network.
class Animation : public Resource {
    Q_OBJECT

public:

    Animation(const QUrl& url);

    const FBXGeometry& getGeometry() const { return *_geometry; }

    virtual bool isLoaded() const override;

    
    Q_INVOKABLE QStringList getJointNames() const;
    
    Q_INVOKABLE QVector<FBXAnimationFrame> getFrames() const;

    const QVector<FBXAnimationFrame>& getFramesReference() const;
    
protected:
    virtual void downloadFinished(const QByteArray& data) override;

protected slots:
    void animationParseSuccess(FBXGeometry* geometry);
    void animationParseError(int error, QString str);

private:
    
    std::unique_ptr<FBXGeometry> _geometry;
};

/// Reads geometry in a worker thread.
class AnimationReader : public QObject, public QRunnable {
    Q_OBJECT

public:
    AnimationReader(const QUrl& url, const QByteArray& data);
    virtual void run();

signals:
    void onSuccess(FBXGeometry* geometry);
    void onError(int error, QString str);

private:
    QUrl _url;
    QByteArray _data;
};

class AnimationDetails {
public:
    AnimationDetails();
    AnimationDetails(QString role, QUrl url, float fps, float priority, bool loop,
        bool hold, bool startAutomatically, float firstFrame, float lastFrame, bool running, float frameIndex);

    QString role;
    QUrl url;
    float fps;
    float priority;
    bool loop;
    bool hold;
    bool startAutomatically;
    float firstFrame;
    float lastFrame;
    bool running;
    float frameIndex;
};
Q_DECLARE_METATYPE(AnimationDetails);
QScriptValue animationDetailsToScriptValue(QScriptEngine* engine, const AnimationDetails& event);
void animationDetailsFromScriptValue(const QScriptValue& object, AnimationDetails& event);

#endif // hifi_AnimationCache_h
