from keras.models import Sequential
from keras.layers import Activation, Dense, Dropout
from keras.utils.np_utils import to_categorical
from keras.optimizers import Adagrad
from keras.optimizers import Adam
import numpy as np
from PIL import Image
import os

# 学習用のデータを作る.
image_list = []
label_list = []

for dir in os.listdir("data/train"):
    if dir == ".DS_Store":
        continue

    dir1 = "data/train/" + dir 
    label = 0

    if dir == "apple":    # apple label 0
        label = 0
    elif dir == "orange": # orange lavel 1
        label = 1

    for file in os.listdir(dir1):
        if file != ".DS_Store":
            label_list.append(label)
            filepath = dir1 + "/" + file
            image = np.array(Image.open(filepath).resize((25, 25)))
            print(filepath)
            image = image.transpose(2, 0, 1)
            image = image.reshape(1, image.shape[0] * image.shape[1] * image.shape[2]).astype("float32")[0]
            image_list.append(image / 255.)

image_list = np.array(image_list)

Y = to_categorical(label_list)

# Create a model and build a neural network
model = Sequential()
model.add(Dense(200, input_dim=1875))
model.add(Activation("relu"))
model.add(Dropout(0.2))

model.add(Dense(200))
model.add(Activation("relu"))
model.add(Dropout(0.2))

model.add(Dense(2))
model.add(Activation("softmax"))

opt = Adam(lr=0.001)
model.compile(loss="categorical_crossentropy", optimizer=opt, metrics=["accuracy"])
model.fit(image_list, Y, nb_epoch=1500, batch_size=100, validation_split=0.1)

total = 0.
ok_count = 0.

for dir in os.listdir("data/train"):
    if dir == ".DS_Store":
        continue

    dir1 = "data/test/" + dir 
    label = 0

    if dir == "apple":
        label = 0
    elif dir == "orange":
        label = 1

    for file in os.listdir(dir1):
        if file != ".DS_Store":
            label_list.append(label)
            filepath = dir1 + "/" + file
            image = np.array(Image.open(filepath).resize((25, 25)))
            print(filepath)
            image = image.transpose(2, 0, 1)
            image = image.reshape(1, image.shape[0] * image.shape[1] * image.shape[2]).astype("float32")[0]
            result = model.predict_classes(np.array([image / 255.]))
            print("label:", label, "result:", result[0])

            total += 1.

            if label == result[0]:
                ok_count += 1.

print("prediction: ", ok_count / total * 100, "%")
