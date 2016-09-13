from __future__ import print_function, division
import numpy as np
from root_find_watch import Newton, Bisection, FixedPoint, Secant
import matplotlib.pyplot as plt
import math
from math import exp, log


def fn(x):
    return x + math.log(x)

def dfn(x):
    return 1 + 1/x

def FixedPoint_fn(x):
    return exp(-x)

x = np.arange(.1,1,.01)
fx_vals = []
for x_ in x:
    fx_vals.append(fn(x_))

plt.rc("text", usetex=True)
plt.rc("font", family="serif")
plt.plot(x, fx_vals)
plt.xlabel("$x$")
plt.ylabel("$f(x)$")
plt.title("$x + \ln(x)$")
plt.savefig("hw2_prob6a.pdf", type="pdf", bbox_inches="tight")
print("Wrote f(x) to hw2_prob6a.pdf")

tol = 1e-10
# Bisection Method
x, bisect_vals = Bisection(fn, 0.5, 0.6, tol)
print("Finished Bisection Method")

# Fixed Point
x, fixed_vals = FixedPoint(FixedPoint_fn, 0.5, tol)
print("Finished Fixed Point Method")

# Newton's Method
x, newton_vals = Newton(fn, dfn, 0.5, tol)
print("Finished Newton's Method")

# Secant Method
x, secant_vals = Secant(fn, 0.5, 0.6, tol)
print("Finished Secant Method")

plt.clf()
plt.plot(bisect_vals, label="Bisection Method")
plt.plot(fixed_vals, label="Fixed Point Method")
plt.plot(newton_vals, label="Newton's Method")
plt.plot(secant_vals, label="Secant Method")
plt.xlabel("Iterations")
plt.ylabel("$f(x)$")
plt.title("$x + \ln(x)$")
plt.legend(loc="best")
plt.xlim(0,15)
plt.ylim(-.1,.05)
plt.savefig("hw2_prob6b.pdf", type="pdf", bbox_inches="tight")
plt.show()

print("Wrote methods to hw2_prob6b.pdf")
