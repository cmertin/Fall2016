from __future__ import print_function, division
import numpy as np

# Implements Newton's Root Finding Method
def Newton(f, df, x0, tol, MAX_ITR=1000):
    for itr in xrange(0, MAX_ITR):
        x = x0 - f(x0)/df(x0)
        delta = abs(x0 - f(x0))
        if abs(f(x0)) < tol or delta < tol:
            return x0, itr
    print("ERROR: Newton Method failed to find the root")
    return -1, MAX_ITR

# Implements the Bisection Method
def Bisection(f, min, max, tol, MAX_ITR=1000):
    for itr in xrange(0, MAX_ITR):
        midPoint = (minX + maxX)/2.0
        if abs(f(midPoint)) < tol or (maxX - minX)/2.0 < tol:
            return midPoint, itr
        if np.sign(f(midPoint)) == np.sign(f(minX)):
            minX = midPoint
        else:
            maxX = midPoint
    print("ERROR: Bisection Method failed to find the root")
    return -1, MAX_ITR

# Implements the Fixed Point Method
def FixedPoint(f, x0, tol, MAX_ITR=1000):
    for itr in xrange(0, MAX_ITR):
        x1 = f(x0)
        if abs(f(x1)) < tol or abs(x1 - x0) < tol:
            return x1, itr
        x0 = x1
    print("ERROR: Fixed Point Method failed to find the root")
    return -1, MAX_ITR

# Implements Secant Method
def Secant(f, x0, x1, tol, MAX_ITR=1000):
    for itr in xrange(0, MAX_ITR):
        x2 = (x0 * f(x1) - x1 * f(x0))/(f(x1) - f(x0))
        if abs(f(x2)) < tol or abs(x2 - x1) < tol:
            return x2, itr
        x0 = x1
        x1 = x2
    print("ERROR: Secant Method failed to find the root")
    return -1, MAX_ITR
