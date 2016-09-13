from __future__ import print_function, division
import numpy as np
from root_find_watch import Newton
import matplotlib.pyplot as plt
from math import exp

def fn(x):
    return (x-1)**2 * exp(x)

def dfn(x):
    return 2*(x-1)*exp(x) + (x-1)**2 * exp(x)

x0 = 2
tol = 1e-10
vals = []

x, vals = Newton(fn, dfn, x0, tol)
itr = range(1, len(vals)+1)

plt.semilogy(itr, vals)
plt.xlabel("Iterations")
plt.ylabel("f(x)")
plt.title("Newton's Method")
#plt.legend(loc="best")
plt.savefig("hw2_prob4.pdf", type="pdf", bbox_inches="tight")
plt.show()
