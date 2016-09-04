from __future__ import division, print_function
import matplotlib.pyplot as plt
import numpy as np
from math import exp, cos, sin

x = 3
d = 1e-11

g1 = (cos(x+d) - cos(x))/d + sin(x)
g2 = (-2 * sin(x + (d/2)) * sin(d/2)) / d + sin(x)

print("g1 = " + str(g1))
print("g2 = " + str(g2))
