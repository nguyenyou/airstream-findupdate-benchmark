import com.raquo.airstream.split.Splittable
import scala.scalajs.js

object AirstreamBundleApp {
  def main(args: Array[String]): Unit = {
    val inputs = Vector.tabulate(256)(identity)
    val updated = Splittable.VectorSplittable.findUpdate(inputs, _ == 128, 999)
    println(js.Dynamic.global.JSON.stringify(js.Dynamic.literal(size = updated.size, value = updated(128))))
  }
}
