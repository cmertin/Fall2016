from __future__ import print_function, division
import numpy as np
import numpy.linalg as npl
import copy as copy
import matplotlib.pyplot as plt
from math import sqrt
from scipy.interpolate import UnivariateSpline

# Returns the values of theta based on the Normal Equation. This is a direct
# solve for the minimum values of theta wihtout having to iterate with
# gradient descent, as most of the other interpolating functions do. Instead it
# calculates the results by using the analytical expression
# Note: Not for large matrices, ie bigger than 10k x 10k
# X: Matrix with each row being a feature vector
# y: 1D vector where each index is the "true value"
def NormalEquation(X, y):
    XT = np.transpose(X)    # X^T
    temp = np.dot(XT, X)    # X^T * X
    temp = npl.pinv(temp)   # Calcualtes the pseudo-inverse to deal with singularity
    temp = np.dot(temp, XT) # (X^T * X)^-1 * X^T
    return np.dot(temp, y)  # theta = (X^T * X)^-1 * X^T * y

def PolynomialInterpolation(x_vals, y, power):
    x = []
    theta = np.zeros(power)
    for x_ in x_vals:
        local_x = []
        for val in range(0, power):
            local_x.append(np.power(x_, val))
        x.append(local_x)
    x = np.asarray(x)
    return NormalEquation(x, y)

def Eval_X_poly(x, theta, power):
    y = []
    for x_ in x:
        local_x = []
        for val in range(0, power):
            local_x.append(np.power(x_, val))
        local_x = np.array(local_x)
        y.append(np.dot(local_x, theta))
    return y

def Eval_X_inter(x, x_vals, inter, epsilon=0.1):
    y = []
    for x_ in x:
        local = []
        for i in range(0, len(x_vals)):
            if i == 0:
                local.append(1)
            else:
                temp = sqrt((x_ - x_vals[i-1])**2 + epsilon**2) - epsilon
                local.append(temp)
        temp = 0
        for i in range(0, len(inter)):
            temp = temp + local[i] * inter[i]
        y.append(temp)
    return y

def Interpolation(x, y, epsilon=0.1):
    d = []
    for x_ in x:
        local = []
        for i in range(0, len(x)):
            if i == 0:
                local.append(1)
            else:
                temp = sqrt((x_ - x[i-1])**2 + epsilon**2) - epsilon
                local.append(temp)
        d.append(local)
    d = np.asarray(d)
    return NormalEquation(d, y)


x = [0.1, 0.15, 0.20, 0.30, 0.35, 0.50, 0.75]
y = [3.0, 2.0,  1.2,  2.1,  2.0,  2.5,  2.5]
x_rng = np.arange(.05, .801, 0.001)

x = np.asarray(x)
y = np.asarray(y)

# Polynomian Interpolation
poly = PolynomialInterpolation(x, y, len(x))
y_poly = Eval_X_poly(x_rng, poly, len(x))
plt.rc('text', usetex=True)
plt.rc('font', family='serif')
plt.plot(x_rng, y_poly, 'r', zorder=1)
plt.scatter(x, y, zorder=2, facecolors='none', edgecolors='b')
plt.xlabel("$x$")
plt.ylabel("$y$")
plt.title("Polynomial Interpolation")
plt.savefig("poly_plot.pdf", bbox_inches="tight")

# Cubic Spline Interpolation
spl = UnivariateSpline(x, y, s=0)
y_spl = spl(x_rng)
plt.clf()
plt.rc('text', usetex=True)
plt.rc('font', family='serif')
plt.plot(x_rng, y_spl, 'r', zorder=1)
plt.scatter(x, y, zorder=2, facecolors='none', edgecolors='b')
plt.xlabel("$x$")
plt.ylabel("$y$")
plt.title("Cubic Spline")
plt.savefig("cubic_plot.pdf", bbox_inches="tight")

# Interpolation Function from the assignment
plt.clf()
plt.rc('text', usetex=True)
plt.rc('font', family='serif')
eps = [0.1, 0.01, 0.001]
f, ax = plt.subplots(len(eps), sharex=True, figsize=(8, 12))
for i in range(0, len(eps)):
    inter = Interpolation(x, y, eps[i])
    y_int = Eval_X_inter(x_rng, x, inter, eps[i])
    title = "$\epsilon = " + str(eps[i]) + "$"
    ax[i].plot(x_rng, y_int, 'r', zorder=1)
    ax[i].scatter(x, y, zorder=2, facecolors='none', edgecolors='b')
    ax[i].set_title(title)
    ax[i].set_ylabel("$y$")

plt.xlabel("$x$")
plt.savefig("int_plot.pdf", bbox_inches="tight")
