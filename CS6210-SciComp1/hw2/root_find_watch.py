from __future__ import print_function, division
import numpy as np

# Implements Newton's Root Finding Method
# Returns the value from each iteration along with the root
def Newton(f, df, x0, tol, MAX_ITR=1000, vals=[]):
    for itr in xrange(0, MAX_ITR):
        vals.append(f(x0))
        x0 = x0 - f(x0)/df(x0)
        delta = abs(x0 - f(x0))
        if abs(f(x0)) < tol or delta < tol:
            return x0, vals
    print("ERROR: Newton Method failed to find the root")
    return -1, vals

# Implements the Bisection Method
# Returns the value from each iteration along with the root
def Bisection(f, minX, maxX, tol, MAX_ITR=1000, vals=[]):
    for itr in xrange(0, MAX_ITR):
        midPoint = (minX + maxX)/2.0
        vals.append(f(midPoint))
        if abs(f(midPoint)) < tol or (maxX - minX)/2.0 < tol:
            return midPoint, vals
        if np.sign(f(midPoint)) == np.sign(f(minX)):
            minX = midPoint
        else:
            maxX = midPoint
    print("ERROR: Bisection Method failed to find the root")
    return -1, vals

# Implements the Fixed Point Method
# Returns the value from each iteration along with the root
def FixedPoint(f, x0, tol, MAX_ITR=1000, vals=[]):
    for itr in xrange(0, MAX_ITR):
        x1 = f(x0)
        vals.append(f(x1) - x1)
        if abs(f(x1)) < tol or abs(x1 - x0) < tol:
            return x1, vals
        x0 = x1
    print("ERROR: Fixed Point Method failed to find the root")
    return -1, vals

# Implements Secant Method
# Returns the value from each iteration along with the root
def Secant(f, x0, x1, tol, MAX_ITR=1000, vals=[]):
    for itr in xrange(0, MAX_ITR):
        x2 = (x0 * f(x1) - x1 * f(x0))/(f(x1) - f(x0))
        vals.append(f(x2))
        if abs(f(x2)) < tol or abs(x2 - x1) < tol:
            return x2, vals
        x0 = x1
        x1 = x2
    print("ERROR: Secant Method failed to find the root")
    return -1, vals
