from __future__ import print_function, division
import numpy as np
import matplotlib.pyplot as plt
from matplotlib import rc

def f(t):
    return np.exp(-3*t)

def v0(t):
    phi0 = 1
    c0 = (1 - np.exp(-9))/9.0
    return phi0 * c0

def v1(t):
    phi1 = 2/3 * t - 1
    c1 = (-7 - 11 * np.exp(-9))/27.0
    return phi1 * c1

def v2(t):
    phi2 = 2/3 * t**2 - 2 * t + 1
    c2 = (65 - 245 * np.exp(-9))/243.0
    return phi2 * c2

def v3(t):
    phi3 = 1/27 * (20 * t**3 - 90 * t**2 + 114*t - 36)
    c3 = (-413 - 5299 * np.exp(-9))/2187.0
    return phi3 * c3

t = np.arange(0, 3.01, .01)

q2 = []
q3 = []

for t_ in t:
    t2 = v0(t_) + v1(t_) + v2(t_)
    t3 = t2 + v3(t_)
    q2.append(f(t_) - t2)
    q3.append(f(t_) - t3)

rc('font',**{'family':'sans-serif','sans-serif':['Helvetica']})
rc('text', usetex=True)

plt.plot(t, q2, label="$f(t) - q_{2}(t)$")
plt.plot(t, q3, label="$f(t) - q_{3}(t)$")
plt.legend(loc='best')
plt.xlabel("$x$")
plt.ylabel("$y$")
plt.savefig("plot1.pdf", bbox_inches="tight")
