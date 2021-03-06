//
//  GeometryUtilTests.h
//  tests/physics/src
//
//  Created by Andrew Meadows on 2014.05.30
//  Copyright 2014 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

#ifndef hifi_AngularConstraintTests_h
#define hifi_AngularConstraintTests_h

#include <QtTest/QtTest>
#include <glm/glm.hpp>

class GeometryUtilTests : public QObject {
    Q_OBJECT
private slots:
    void testLocalRayRectangleIntersection();
    void testWorldRayRectangleIntersection();
    void testTwistSwingDecomposition();
};

float getErrorDifference(const float& a, const float& b);
float getErrorDifference(const glm::vec3& a, const glm::vec3& b);

#endif // hifi_AngularConstraintTests_h
