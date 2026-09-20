import scala.scalajs.js
import scala.scalajs.js.annotation.{JSExport, JSExportTopLevel}

@JSExportTopLevel("FindUpdateBench")
object FindUpdateBench {
  @JSExport
  def setup(size: Int, matchIndex: Int): js.Function1[Int, Double] = {
    val input = Vector.tabulate(size)(identity)
    val predicate: Int => Boolean = value => value == matchIndex
    (iterations: Int) => {
      var i = 0
      var checksum = 0.0
      while (i < iterations) {
        checksum += findUpdate(input, predicate, -1).head
        i += 1
      }
      checksum
    }
  }

  private def findUpdate(
    inputs: Vector[Int],
    predicate: Int => Boolean,
    newItem: Int
  ): Vector[Int] = {
    val index = inputs.indexWhere(predicate)
    if (index == -1) inputs else inputs.updated(index, newItem)
  }
}
